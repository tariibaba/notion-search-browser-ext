import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import { debounce } from 'throttle-debounce';

import { FiltersBy, MATCH_TAG, SortBy, STORAGE_KEY } from './constants';

const TIMEOUT = 5_000;
const NOTION_HOST = 'https://www.notion.so';
const NOTION_SEARCH_URL = `${NOTION_HOST}/api/v3/search`;
const SEARCH_LIMIT = 50;
const DEBOUNCE_TIME = 150;
const CACHE_TIME = 15 * 60 * 1_000;

const AxiosInstance = axios.create({
  adapter: setupCache({
    maxAge: CACHE_TIME,
    exclude: { methods: [] },
  }).adapter,
});

export const debouncedSearch = debounce(search, DEBOUNCE_TIME);

// TODO: 結合テストくらいは書きたい気がする。。
async function search({
  query,
  sortBy,
  filtersBy,
  savesLastSearchResult,
}: {
  query: string;
  sortBy: string;
  filtersBy: FiltersBy;
  savesLastSearchResult: boolean;
}) {
  let sortOptions = {};
  switch (sortBy) {
    case SortBy.RELEVANCE:
      sortOptions = { field: 'relevance' };
      break;
    case SortBy.LASTEDITED:
      sortOptions = { field: 'lastEdited', direction: 'desc' };
      break;
    case SortBy.CREATED:
      sortOptions = { field: 'created', direction: 'desc' };
      break;
    default:
      throw new Error(`unknown sortBy: ${sortBy}`);
  }
  const filterOptions: { navigableBlockContentOnly?: boolean } = {};
  for (const [key, value] of Object.entries(filtersBy)) {
    switch (key) {
      case FiltersBy.TITLE_ONLY:
        if (value) filterOptions.navigableBlockContentOnly = true;
        break;
      default:
        throw new Error(`unknown key: ${key}`);
    }
  }

  let res: ApiResponse;
  try {
    res = (
      await AxiosInstance.post<ApiResponse>(
        NOTION_SEARCH_URL,
        {
          type: 'BlocksInSpace',
          query,
          spaceId: idToUuid('81149e3a3d874d25b7082226dd72bfdd'),
          limit: SEARCH_LIMIT,
          filters: {
            isDeletedOnly: false,
            excludeTemplates: false,
            isNavigableOnly: false,
            requireEditPermissions: false,
            ancestors: [],
            createdBy: [],
            editedBy: [],
            lastEditedTime: {},
            createdTime: {},
            ...filterOptions,
          },
          sort: sortOptions,
          source: 'quick_find_input_change',
        },
        { timeout: TIMEOUT },
      )
    ).data;
  } catch (error) {
    console.trace(error);
    throw new Error(
      `HTTP Request error. ` +
        (error instanceof Error && error.name === 'AxiosError'
          ? error.message
          : error),
    );
  }

  const searchResult: SearchResult = {
    items: res.results.map((data) => {
      const recordMap = res.recordMap;
      const record = recordMap.block[data.id].value;
      const result: Item = { title: '', url: '' };
      const regexpRemovesTag = new RegExp(`</?${MATCH_TAG}>`, 'ig');
      const regexpAddsTag = new RegExp(
        `(${query.split(/\s+/).join('|')})`,
        'ig',
      );

      const getParentPath = (paths: string[], parentId: string): string[] => {
        if (!recordMap.block[parentId]) return paths;

        const record = recordMap.block[parentId].value;
        paths.push(record.properties.title.map((array) => array[0]).join(''));
        if (!record.parent_id) return paths;
        return getParentPath(paths, record.parent_id);
      };
      if (record.parent_id) {
        const parentPaths = getParentPath([], record.parent_id);
        if (parentPaths.length >= 1)
          result.parentsPath = parentPaths.reverse().join(' / ');
      }

      const pageIcon = record.format?.page_icon;
      if (pageIcon) result.pageIcon = pageIcon;

      result.url = `${NOTION_HOST}/${data.id.replaceAll('-', '')}`;
      result.title = data.highlight?.title
        ? data.highlight.title
        : record.properties.title.map((array) => array[0]).join('');

      if (data.highlight && data.highlightBlockId) {
        result.url += `#${data.highlightBlockId.replaceAll('-', '')}`;
        result.text = data.highlight.text;
      }
      const setStrangeNotionTag = (str: string) =>
        query
          ? str
              .replace(regexpRemovesTag, '')
              .replace(regexpAddsTag, `<${MATCH_TAG}>$1</${MATCH_TAG}>`)
          : str;
      if (result.title) result.title = setStrangeNotionTag(result.title);
      if (result.text) result.text = setStrangeNotionTag(result.text);

      return result;
    }),
    total: res.total,
  };

  if (savesLastSearchResult) {
    const data: StorageData = { query, searchResult };
    try {
      await chrome.storage.local.set({
        [STORAGE_KEY]: data,
      });
    } catch (error) {
      throw new Error(`Failed to set data to storage.local. error: ${error}`);
    }
  }

  return searchResult;
}

// ========================================
// Utils
// ========================================

function idToUuid(path: string) {
  return `${path.substring(0, 8)}-${path.substring(8, 12)}-${path.substring(
    12,
    16,
  )}-${path.substring(16, 20)}-${path.substring(20)}`;
}