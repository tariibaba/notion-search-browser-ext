import debounce from 'lodash.debounce';
import escapeHtml from 'lodash.escape';

const NOTION_HOST = 'https://www.notion.so';
const NOTION_SEARCH_URL = `${NOTION_HOST}/api/v3/search`;
const DEBOUNCE_TIME = 150;
const MIN_SEARCH_LENGTH = 1;
const STRANGE_NOTION_TAG = 'gzkNfoUU';
let POPUP_MODE = false;

/* TODO
  - browserAction のアイコン
  - 前回の状態保持 （）
  - (pagenation)
*/

const onInput = debounce(search, DEBOUNCE_TIME);

const input = querySeletor<HTMLInputElement>('.search');

input.focus();
input.addEventListener('input', () => onInput(input.value));

if (location.search === '?popup') {
  document.body.style.width = '662px';
  document.body.style.margin = '0px';
  POPUP_MODE = true;
} else {
  document.body.style.margin = '40px 0 0 0';
}
querySeletor('main').classList.remove('hide');

querySeletor('.icon-clear-input-container').addEventListener(
  'click',
  (event: Event) => {
    input.value = '';
    event.preventDefault();
  },
);

async function search(query: string) {
  const resultElem = querySeletor('.items');

  if (query.length <= MIN_SEARCH_LENGTH) {
    resultElem.innerText = '';
    return;
  }

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
    const value = recordMap.block[data.id].value;
    const result: Result = { title: '', url: '' };

    const getParentPath = (paths: string[], parentId: string): string[] => {
      if (!recordMap.block[parentId]) return paths;

      const value = recordMap.block[parentId].value;
      paths.push(value.properties.title.map((array) => array[0]).join(''));
      if (!value.parent_id) return paths;
      return getParentPath(paths, value.parent_id);
    };
    if (value.parent_id) {
      const parentPaths = getParentPath([], value.parent_id);
      if (parentPaths.length >= 1)
        result.parentsPath = parentPaths.reverse().join(' / ');
    }

    const pageIcon = value.format?.page_icon;
    if (pageIcon) result.pageIcon = pageIcon;

    const id = data.id.replaceAll('-', '');

    if (data.highlight.title) {
      result.title = data.highlight.title;
      result.url = NOTION_HOST + '/' + id;
    } else {
      result.title = value.properties.title.map((array) => array[0]).join('');
      result.text = data.highlight.text;
      result.url = `${NOTION_HOST}/${id}#${data.highlightBlockId.replaceAll(
        '-',
        '',
      )}`;
    }
    return result;
  });

  results = escape(results);

  resultElem.innerHTML = render(results);
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

const regexp = new RegExp(
  `&lt;${STRANGE_NOTION_TAG}&gt;(.+?)&lt;/${STRANGE_NOTION_TAG}&gt;`,
  'g',
);
function escape(results: Results): Results {
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

const defaultIcon = `
  <svg viewBox="0 0 30 30" class="icon-document">
    <g>
      <path
        d="M16,1H4v28h22V11L16,1z M16,3.828L23.172,11H16V3.828z M24,27H6V3h8v10h10V27z M8,17h14v-2H8V17z M8,21h14v-2H8V21z M8,25h14v-2H8V25z"
      ></path>
    </g>
  </svg>`;

function render(results: Results): string {
  return results
    .map((data: Result) => {
      return `
      <div class="item">
        <a class="url" ${POPUP_MODE ? 'target="_blank"' : ''} href="${
        data.url
      }">
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
