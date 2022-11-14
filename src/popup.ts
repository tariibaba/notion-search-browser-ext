import debounce from 'lodash.debounce';
import escape from 'lodash.escape';
import errors from './errors';

const NOTION_HOST = 'https://www.notion.so';
const NOTION_SEARCH_URL = `${NOTION_HOST}/api/v3/search`;
const DEBOUNCE_TIME = 150;
const MIN_QUERY_LENGTH = 1;
const SEARCH_LIMIT = 50;
const STRANGE_NOTION_TAG = 'gzkNfoUU';
const STORAGE_KEY = 'last-searched';
const POPUP = location.search === '?popup';
const TIMEOUT_MSEC = 5_000;

let LAST_QUERY = '';

const inputElem = querySeletor<HTMLInputElement>('.search');

// set style
if (POPUP) {
  // css ファイルを append した方が見通しは良くなるが、同期的なスタイル適用が出来ない
  document.body.style.width = '662px';
  document.body.style.margin = '0px';
  // document.body.style.height = '550px';
} else {
  document.body.style.margin = '40px 0 0 0';
  querySeletor('.items').style.maxHeight = 'calc(100vh - 135px)';
}

// render from storage
if (POPUP) {
  const store: StorageData = (await chrome.storage.local.get(STORAGE_KEY))[
    STORAGE_KEY
  ];
  if (store) {
    LAST_QUERY = store.query;
    inputElem.value = store.query;
    render(store.results);
  }
}

querySeletor('main').classList.remove('hide');

// display: none にしてた要素に autofocus 属性は効かないため、仕方なく
inputElem.focus();

querySeletor('.icon-clear-input-container').addEventListener(
  'click',
  async (event: Event) => {
    inputElem.value = '';
    render(await search(''));
    event.preventDefault();
  },
);

const onInput = debounce(async (query: string) => {
  render(await search(query));
}, DEBOUNCE_TIME);
inputElem.addEventListener('input', () => onInput(inputElem.value.trim()));

async function search(query: string): Promise<SearchResults> {
  if (query.length <= MIN_QUERY_LENGTH)
    return { error: errors.MIN_QUERY_LENGTH, items: [], total: 0 };

  if (LAST_QUERY === query)
    return { error: errors.SAME_QUERY, items: [], total: 0 };

  LAST_QUERY = query;

  let res: Res;
  try {
    res = await fetchJSON(NOTION_SEARCH_URL, {
      method: 'POST',
      body: {
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
        },
        sort: { field: 'relevance' },
        source: 'quick_find_input_change',
      },
    });
  } catch (error) {
    return { error: errors.HTTP_REQUEST_FAILED, items: [], total: 0 };
  }

  const results: SearchResults = {
    items: res.results.map((data) => {
      const recordMap = res.recordMap;
      const record = recordMap.block[data.id].value;
      const result: Item = { title: '', url: '' };

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

      if (data.highlight?.title) {
        result.title = data.highlight.title;
      } else if (data.highlight && data.highlightBlockId) {
        result.title = record.properties.title
          .map((array) => array[0])
          .join('');
        result.url += `#${data.highlightBlockId.replaceAll('-', '')}`;
        result.text = data.highlight.text;
      } else {
        result.title = record.properties.title
          .map((array) => array[0])
          .join('')
          .replace(
            new RegExp(`(${query.split(/\s/).join('|')})`, 'ig'),
            `<${STRANGE_NOTION_TAG}>$1</${STRANGE_NOTION_TAG}>`,
          );
      }
      return result;
    }),
    total: res.total,
    error: null,
  };
  if (POPUP)
    chrome.storage.local
      .set({ [STORAGE_KEY]: { query, results } })
      .catch((error) =>
        console.error(`failed to set data to storage.local. error: ${error}`),
      );

  return results;
}

function render({ items, total, error }: SearchResults) {
  const itemsElem = querySeletor('.items');
  const summaryElem = querySeletor('.summary');

  if (error) {
    switch (error) {
      case errors.SAME_QUERY:
      case errors.HTTP_REQUEST_FAILED:
        return; // noop

      case errors.MIN_QUERY_LENGTH:
        itemsElem.innerHTML = '';
        summaryElem.innerHTML = '';
        return;

      default:
        throw new Error(`unknown error: ${error}`);
    }
  }

  summaryElem.innerHTML =
    total > SEARCH_LIMIT
      ? `<span class="highlight">${SEARCH_LIMIT}</span> of <span class="highlight">${total}</span> results`
      : `<span class="highlight">${total}</span> results`;

  if (total === 0) {
    itemsElem.innerHTML = '';
    return;
  }

  const defaultIcon = `
    <svg viewBox="0 0 30 30" class="icon-document">
      <g>
        <path
          d="M16,1H4v28h22V11L16,1z M16,3.828L23.172,11H16V3.828z M24,27H6V3h8v10h10V27z M8,17h14v-2H8V17z M8,21h14v-2H8V21z M8,25h14v-2H8V25z"
        ></path>
      </g>
    </svg>`;

  const regexp = new RegExp(
    escape(`<${STRANGE_NOTION_TAG}>`) +
      '(.+?)' +
      escape(`</${STRANGE_NOTION_TAG}>`),
    'g',
  );
  const addHighlight = (str: string) =>
    str.replace(regexp, '<span class="highlight">$1</span>');

  querySeletor('.items').innerHTML = items
    .map((data: Item) => {
      return `
      <div class="item">
        <a class="url" ${POPUP ? 'target="_blank"' : ''} href="${data.url}">
          <div class="article-icon-container">
            ${data.pageIcon || defaultIcon}
          </div>
          <div class="main-item">
            <p class="title">${addHighlight(escape(data.title))}</p>
            ${
              data.parentsPath
                ? `<p class="parents-path">${escape(data.parentsPath)}</p>`
                : ''
            }
            ${
              data.text
                ? `<p class="text">${addHighlight(escape(data.text))}</p>`
                : ''
            }
          </div>
        </a>
      </div>`;
    })
    .join('\n');
}

// ========================================
// Utils
// ========================================

function querySeletor<T extends HTMLElement>(selector: string) {
  const elem = document.querySelector<T>(selector);
  if (!elem) {
    throw new Error(`Element "${selector}"`);
  }
  return elem;
}

function idToUuid(path: string) {
  return `${path.substring(0, 8)}-${path.substring(8, 12)}-${path.substring(
    12,
    16,
  )}-${path.substring(16, 20)}-${path.substring(20)}`;
}

async function fetchJSON(
  url: string,
  { method, body }: { method: 'POST'; body: object },
) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MSEC);

  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    return (await response.json()) as Res;
  } catch (error) {
    const message =
      error instanceof Error && error.name === 'AbortError'
        ? `HTTP Request timeout (${TIMEOUT_MSEC} milliseconds)`
        : `HTTP Request error. ${error}`;

    console.error(message);
    alert(message);

    throw new Error(message);
  }
}
