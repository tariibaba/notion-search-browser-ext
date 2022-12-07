import { debounce } from 'throttle-debounce';
import { axios } from '../axios';
import { NOTION_HOST } from '../constants';
import { storage } from '../storage';

import {
  FiltersBy,
  ICON_TYPE,
  MATCH_TAG,
  SortBy,
  STORAGE_KEY,
} from './constants';

const PATH = '/search';
const SEARCH_LIMIT = 50;
const DEBOUNCE_TIME = 150;
const ICON_WIDTH = 40;
const REGEXP_REMOVES_TAG = new RegExp(`</?${MATCH_TAG}>`, 'ig');

const BLOCK_TYPE = {
  PAGE: 'page',
  COLLECTION_VIEW_PAGE: 'collection_view_page',
} as const;

const TABLE_TYPE = {
  SPACE: 'space',
  BLOCK: 'block',
  COLLECTION: 'collection',
} as const;
type TableType = valueOf<typeof TABLE_TYPE>;

type RecordBase<Value> = {
  [id: string]: {
    value: Value;
  };
};

type RecordValueBase = {
  parent_id?: string;
  format?: {
    page_icon?: string;
  };
  parent_table: TableType;
};
type RecordValueBaseAdditionalProperties = {
  properties: {
    title: string[][];
  };
};

// collection view page を parent に持つ database 。
// https://notion.so/${id} してもページは見れない。
// ( Web で見るなら collection view page で見る)
// ex) 4c3edd73-64cb-46b7-9f15-86458800c192
//     0351f04a-0e77-4164-b12b-614f75ecf9c7
type RecordCollection = RecordValueBase & {
  name: string[][];
};

type RecordBlockPage = RecordValueBase & {
  type: typeof BLOCK_TYPE.PAGE;
} & Required<RecordValueBaseAdditionalProperties>;
// database の parent となるページ
// ex) https://www.notion.so/ecc6660b01854c34af95907a7bf77548
//     https://www.notion.so/4897c80a8baa4c4d92617e1f627121bf
type RecordBlockCollectionViewPage = RecordValueBase & {
  type: typeof BLOCK_TYPE.COLLECTION_VIEW_PAGE;
  collection_id: string; // view page だけ作って database 未登録の場合に存在しない
  properties: {
    title: string[][];
  };
} & Partial<RecordValueBaseAdditionalProperties>;

type RecordBlock = RecordBlockPage | RecordBlockCollectionViewPage;

type Res = {
  results: {
    id: string;
    highlight?: {
      text: string;
      title?: string;
    };
    highlightBlockId?: string;
  }[];
  recordMap: {
    // TODO 検索結果 0 件のときは無いけど ...
    // それ以外のときに欠落するケースあるのだろうか？ (検索結果が全部 collection とか...)
    // カレンダーだけのページ作って検証するか ... 。
    block: RecordBase<RecordBlock>;
    collection?: RecordBase<RecordCollection>;
  };
  total: number;
};

// NOTE: 結合テストくらいは書きたい気がする。。
const search = async ({
  query,
  sortBy,
  filtersBy,
  usesLastSearchResult,
  spaceId,
}: {
  query: string;
  sortBy: string;
  filtersBy: FiltersBy;
  usesLastSearchResult: boolean;
  spaceId: string;
}) => {
  if (!spaceId) throw new Error('spaceId is empty');

  let sortOptions = {};
  switch (sortBy) {
    case SortBy.RELEVANCE:
      sortOptions = { field: 'relevance' };
      break;
    case SortBy.LAST_EDITED:
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

  const res = (
    await axios.post<Res>(PATH, {
      type: 'BlocksInSpace',
      query,
      spaceId,
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
    })
  ).data;

  // TODO: パースエラーを送信したい（ユーザーはこちらの想定してないタイプのobjectを扱う可能性が高いので）
  // TODO: 空タイトルのページはどうなる？ （考えたくもないが。。。）
  const recordMap = res.recordMap;
  const searchResult: SearchResult = {
    items: res.results.map((data) => {
      const id = data.id;
      const recordBlock = recordMap.block[id].value;
      const result: Item = { title: '', url: '' };
      const regexpAddsTag = new RegExp(
        `(${query.split(/\s+/).join('|')})`,
        'ig',
      );
      const blockType = recordBlock.type;
      if (!Object.values(BLOCK_TYPE).includes(blockType))
        // NOTE: Setnry とかに送りたい ... 。てか、型ガードで一気に検査すべきか
        console.error(`unknown block type: ${blockType}`);

      const getParentPath = (
        paths: string[],
        id: string,
        tableType: Exclude<TableType, typeof TABLE_TYPE.SPACE>,
      ): string[] => {
        if (!Object.values(TABLE_TYPE).includes(tableType))
          console.error(`unknown table type: ${tableType}`); // NOTE: Setnry とかに送りたい...

        // TODO: switch
        if (tableType === TABLE_TYPE.COLLECTION) {
          const collection = recordMap.collection?.[id]?.value;
          if (!collection) {
            console.error(`id:${id} is not found in recordMap.collection`);
            return paths;
          }

          const parentId = collection.parent_id;
          if (!parentId) return paths;

          const parentTableType = collection.parent_table;
          if (parentTableType === TABLE_TYPE.SPACE) return paths;

          return getParentPath(paths, parentId, parentTableType);
        }

        let block: RecordBlock | undefined = undefined;
        const recordBlock = recordMap.block[id]?.value;
        if (!recordBlock) {
          console.error(`id:${id} is not found in recordMap.block`);
          return paths;
        }
        const type = recordBlock.type;
        if (type === BLOCK_TYPE.COLLECTION_VIEW_PAGE) {
          // TODO: collection view page も properties.title があって collection_id が無いときがある（クラスカのときに対応。。。）
          const collection =
            recordMap.collection?.[recordBlock.collection_id]?.value;
          if (!collection) {
            console.error(
              `id:${recordBlock.collection_id} is not found in recordMap.collection`,
            );
            return paths;
          }
          block = recordMap.block[id].value;
          if (!block) {
            console.error(`id:${id} is not found in recordMap.block`);
            return paths;
          }
          paths.push(collection.name.map((array) => array[0]).join(''));
        } else {
          block = recordMap.block[id].value;
          if (!block) {
            console.error(`id:${id} is not found in recordMap.block`);
            return paths;
          }
          paths.push(
            (block as RecordBlockPage).properties.title
              .map((array) => array[0])
              .join(''),
          );
        }
        const parentId = block.parent_id;
        if (!parentId) return paths;

        const parentTableType = block.parent_table;
        if (parentTableType === TABLE_TYPE.SPACE) return paths;

        return getParentPath(paths, parentId, parentTableType);
      };

      const tableType = recordBlock.parent_table;
      if (!Object.values(TABLE_TYPE).includes(tableType))
        console.error(`unknown table type: ${tableType}`); // NOTE: Setnry とかに送りたい...

      if (recordBlock.parent_id && tableType !== TABLE_TYPE.SPACE) {
        const parentPaths = getParentPath([], recordBlock.parent_id, tableType);

        if (parentPaths.length >= 1)
          result.parentsPath = parentPaths.reverse().join(' / ');
      }

      const pageIcon = recordBlock.format?.page_icon;
      if (pageIcon) {
        result.pageIcon = pageIcon.startsWith('http')
          ? {
              type: ICON_TYPE.IMAGE,
              value:
                `${NOTION_HOST}/image/${encodeURIComponent(pageIcon)}` +
                '?table=block' +
                `&id=${id}` +
                `&width=${ICON_WIDTH}`,
            }
          : {
              type: ICON_TYPE.EMOJI,
              value: pageIcon,
            };
      }

      result.url = `${NOTION_HOST}/${id.replaceAll('-', '')}`;

      let title: string | undefined =
        data.highlight?.title ??
        recordBlock.properties?.title?.map((array) => array[0]).join('');

      // TODO: switch
      if (
        typeof title === 'undefined' &&
        recordBlock.type === BLOCK_TYPE.COLLECTION_VIEW_PAGE &&
        recordBlock.collection_id
      ) {
        const recordCollection =
          recordMap.collection?.[recordBlock.collection_id]?.value;
        if (!recordCollection) {
          console.error(
            `id:${recordBlock.collection_id} is not found in recordMap.collection`,
          );
          title = 'No Title';
        } else {
          title = recordCollection.name.map((array) => array[0]).join('');
        }
      }
      if (typeof title === 'undefined') {
        console.error(`Title is not defined. id:${id}`);
        result.title = 'No Title';
      } else {
        result.title = title;
      }

      if (data.highlight && data.highlightBlockId) {
        result.url += `#${data.highlightBlockId.replaceAll('-', '')}`;
        result.text = data.highlight.text;
      }
      const setStrangeNotionTag = (str: string) =>
        query
          ? str
              .replace(REGEXP_REMOVES_TAG, '')
              .replace(regexpAddsTag, `<${MATCH_TAG}>$1</${MATCH_TAG}>`)
          : str;
      if (result.title) result.title = setStrangeNotionTag(result.title);
      if (result.text) result.text = setStrangeNotionTag(result.text);

      return result;
    }),
    total: res.total,
  };

  if (usesLastSearchResult) {
    const data: SearchResultCache = { query, searchResult };
    // set に失敗しても致命的ではない (前回の検索結果が表示されなくなるだけ) なので、エラーハンドリングしない
    storage.set({
      [`${spaceId}-${STORAGE_KEY.LAST_SEARCHED}`]: data,
    });
  }

  return searchResult;
};

export const debouncedSearch = debounce(search, DEBOUNCE_TIME);
