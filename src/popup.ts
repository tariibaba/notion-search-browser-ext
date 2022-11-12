import debounce from 'lodash.debounce';
import escapeHtml from 'lodash.escape';

const NOTION_HOST = 'https://www.notion.so';
const NOTION_SEARCH_URL = `${NOTION_HOST}/api/v3/search`;
const DEBOUNCE_TIME = 150;
const MIN_SEARCH_LENGTH = 1;
const STRANGE_NOTION_TAG = 'gzkNfoUU';
const STORAGE_KEY = 'last-searched';
let POPUP = false;

/* TODO
  - browserAction のアイコン
  - (pagenation)
*/

const searchFn = search();
const onInput = debounce(searchFn, DEBOUNCE_TIME);

const input = querySeletor<HTMLInputElement>('.search');
const resultElem = querySeletor('.items');

// set style
if (location.search === '?popup') {
  document.body.style.width = '662px';
  document.body.style.margin = '0px';
  POPUP = true;
} else {
  document.body.style.margin = '40px 0 0 0';
}

// render from cache
// if (POPUP) {
const cache: { query: string; results: Results } = (
  await chrome.storage.local.get(STORAGE_KEY)
)[STORAGE_KEY];
if (cache) {
  input.value = cache.query;
  resultElem.innerHTML = render(escape(cache.results));
}
// }

querySeletor('main').classList.remove('hide');

input.focus();
input.addEventListener('input', () => onInput(input.value.trim()));

querySeletor('.icon-clear-input-container').addEventListener(
  'click',
  (event: Event) => {
    input.value = '';
    event.preventDefault();
  },
);

function search() {
  let lastQuery = '';
  return async function (query: string) {
    if (query.length <= MIN_SEARCH_LENGTH) {
      resultElem.innerText = '';
      return;
    }
    if (lastQuery === query) return;
    lastQuery = query;

    const body = JSON.stringify({
      type: 'BlocksInSpace',
      query,
      spaceId: idToUuid('81149e3a3d874d25b7082226dd72bfdd'),
      limit: 10,
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
    });

    const response = await fetch(NOTION_SEARCH_URL, {
      method: 'POST',
      body,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const res = (await response.json()) as Res;

    let results: Results = res.results.map((data) => {
      const recordMap = res.recordMap;
      const record = recordMap.block[data.id].value;
      const result: Result = { title: '', url: '' };

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
        console.log(`(${query.split(/\s/).join('|')})`);
        console.log(record.properties.title.map((array) => array[0]).join(''));
        result.title = record.properties.title
          .map((array) => array[0])
          .join('')
          .replace(
            new RegExp(`(${query.split(/\s/).join('|')})`, 'ig'),
            `<${STRANGE_NOTION_TAG}>$1</${STRANGE_NOTION_TAG}>`,
          );
      }
      return result;
    });
    // if (POPUP)
    chrome.storage.local
      .set({ [STORAGE_KEY]: { query, results } })
      .catch((error) =>
        console.error(`failed to set data to storage.local. error: ${error}`),
      );

    resultElem.innerHTML = render(escape(results));
  };
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

function escape(results: Results): Results {
  const regexp = new RegExp(
    `&lt;${STRANGE_NOTION_TAG}&gt;(.+?)&lt;/${STRANGE_NOTION_TAG}&gt;`,
    'g',
  );
  const addHighlight = (str: string) =>
    str.replace(regexp, '<span class="highlight">$1</span>');
  return structuredClone(results).map((result) => {
    result.title = addHighlight(escapeHtml(result.title));
    if (result.text) {
      result.text = addHighlight(escapeHtml(result.text));
    }
    if (result.parentsPath) {
      result.parentsPath = escapeHtml(result.parentsPath);
    }
    return result;
  });
}

function render(results: Results): string {
  const defaultIcon = `
    <svg viewBox="0 0 30 30" class="icon-document">
      <g>
        <path
          d="M16,1H4v28h22V11L16,1z M16,3.828L23.172,11H16V3.828z M24,27H6V3h8v10h10V27z M8,17h14v-2H8V17z M8,21h14v-2H8V21z M8,25h14v-2H8V25z"
        ></path>
      </g>
    </svg>`;

  return results
    .map((data: Result) => {
      return `
      <div class="item">
        <a class="url" ${POPUP ? 'target="_blank"' : ''} href="${data.url}">
          <div class="article-icon-container">
            ${data.pageIcon || defaultIcon}
          </div>
          <div class="main-item">
            <p class="title">${data.title}</p>
            ${
              data.parentsPath
                ? `<p class="parents-path">${data.parentsPath}</p>`
                : ''
            }
            ${data.text ? `<p class="text">${data.text}</p>` : ''}
          </div>
        </a>
      </div>`;
    })
    .join('\n');
}
