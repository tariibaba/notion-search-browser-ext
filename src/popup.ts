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
    highlight: {
      text: string;
      title?: string;
    };
    highlightBlockId: string;
  }[];
  recordMap: {
    block: {
      [id: string]: {
        value: {
          properties: { title: string[][] };
          parent_id: string;
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
  const result: any = res.results.map((result) => {
    if (result.highlight.title) {
      return {
        title: result.highlight.title,
        url: NOTION_HOST + '/' + result.id.replaceAll('-', ''),
      };
    } else {
      return {
        title: res.recordMap.block[result.id].value.properties.title
          .map((array) => array[0])
          .join(''),
        text: result.highlight.text,
        url:
          NOTION_HOST +
          '/' +
          result.id.replaceAll('-', '') +
          '#' +
          result.highlightBlockId.replaceAll('-', ''),
      };
    }
  });
  resultElem.innerText = JSON.stringify(result, null, 2);
  const resElem = document.getElementById('res');
  if (resElem) resElem.innerText = JSON.stringify(res, null, 2);
};

const debounce = (fn: (...args: any[]) => void, wait: number) => {
  let timerId: number | null = null;
  return (...args: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = window.setTimeout(() => {
      fn(...args);
    }, wait);
  };
};
/* TODO
  - favicon
  - parents name
*/

const onInput = debounce(search, DEBOUNCE_TIME);

const input = document.getElementById('query') as HTMLInputElement;
if (!input) throw new Error('input element is not found');

input.focus();
input.addEventListener('input', () => onInput(input.value));
