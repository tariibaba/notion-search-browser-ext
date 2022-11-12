import debounce from 'lodash.debounce';
import escape from 'lodash.escape';

const NOTION_HOST = 'https://www.notion.so';
const NOTION_SEARCH_URL = `${NOTION_HOST}/api/v3/search`;
const DEBOUNCE_TIME = 150;
const MIN_SEARCH_LENGTH = 1;
const STRANGE_NOTION_TAG = 'gzkNfoUU';

function idToUuid(path: string) {
  return `${path.substr(0, 8)}-${path.substr(8, 4)}-${path.substr(
    12,
    4,
  )}-${path.substr(16, 4)}-${path.substr(20)}`;
}

type Res = {
  results: {
    id: string;
    highlight: { text: string; title?: string };
    highlightBlockId: string;
    featureGroups?: object[]; // TODO: 最後に消す
    sources?: string[]; // TODO: 最後に消す
    analytics?: object;
  }[];
  recordMap: {
    block: {
      [id: string]: {
        value: {
          properties: { title: string[][] };
          parent_id?: string;
          format?: { page_icon?: string };
        };
      };
    };
  };
};

const search = async (query: string) => {
  const resultElem = document.getElementById('result');
  if (!resultElem) throw new Error('code block is not found'); // FIXME

  if (query.length <= MIN_SEARCH_LENGTH) {
    resultElem.innerText = '';
    return;
  }

  const body = JSON.stringify({
    type: 'BlocksInSpace',
    // TODO: 検索結果 0 の理由、SpaceID と permission, host_permission が臭う ...
    query: query,
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
  const results: any = res.results.map((result) => {
    const recordMap = res.recordMap;
    const value = recordMap.block[result.id].value;

    const parentPaths: string[] = [];
    const getParentPath = (parentId: string) => {
      if (!recordMap.block[parentId]) return;

      const value = recordMap.block[parentId].value;
      parentPaths.push(
        value.properties.title.map((array) => array[0]).join(''),
      );
      if (value.parent_id) getParentPath(value.parent_id);
    };
    if (value.parent_id) getParentPath(value.parent_id);

    const pageIcon = value.format?.page_icon;

    if (result.highlight.title) {
      return {
        title: result.highlight.title,
        url: NOTION_HOST + '/' + result.id.replaceAll('-', ''),
        pageIcon,
        parentsPath: parentPaths.reverse().join(' / '), // TODO: 存在しないキーではキーごとなくしたい
      };
    } else {
      return {
        title: value.properties.title.map((array) => array[0]).join(''),
        text: result.highlight.text,
        url: `${NOTION_HOST}/${result.id.replaceAll(
          '-',
          '',
        )}#${result.highlightBlockId.replaceAll('-', '')}`,
        pageIcon,
        parentsPath: parentPaths.reverse().join(' / '),
      };
    }
  });

  const svg = `
    <svg viewBox="0 0 30 30" style="width: 18px; height: 18px; display: block; fill: rgba(55, 53, 47, 0.45); flex-shrink: 0; backface-visibility: hidden;">
      <g>
        <path d="M16,1H4v28h22V11L16,1z M16,3.828L23.172,11H16V3.828z M24,27H6V3h8v10h10V27z M8,17h14v-2H8V17z M8,21h14v-2H8V21z M8,25h14v-2H8V25z">
        </path>
      </g>
    </svg>`;

  resultElem.innerHTML = results
    .map((result: any) => {
      result.title = escape(result.title).replace(
        /&lt;gzkNfoUU&gt;(.+?)&lt;\/gzkNfoUU&gt;/g,
        '<b>$1</b>',
      );
      if (result.text)
        result.text = escape(result.text).replace(
          /&lt;gzkNfoUU&gt;(.+?)&lt;\/gzkNfoUU&gt;/g,
          '<b>$1</b>',
        );
      result.parentsPath = escape(result.parentsPath);

      return `
          <div style="border: solid 3px black;">
              <p>
                ${result.pageIcon || svg}
                ${result.title}
              </p>
              ${result.parentsPath ? `<p>${result.parentsPath}</p>` : ''}
              ${result.text ? `<p>${result.text}</p>` : ''}
          </div>
  `;
    })
    .join('\n');

  const resElem = document.getElementById('res');
  res.results.forEach((r) => {
    delete r.featureGroups;
    delete r.sources;
    delete r.analytics;
  });
  if (resElem) resElem.innerText = JSON.stringify(res, null, 2);
};

/* TODO
  - 起動時は last modified でソートしても良い気がするが ... query="" の検索無理じゃね？
  - XSS ...
*/

const onInput = debounce(search, DEBOUNCE_TIME);

const input = document.getElementById('query') as HTMLInputElement;
if (!input) throw new Error('input element is not found');

input.focus();
input.addEventListener('input', () => onInput(input.value));
