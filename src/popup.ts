const NOTION_HOST = 'https://www.notion.so';
const NOTION_SEARCH_URL = `${NOTION_HOST}/api/v3/search`;

function idToUuid(path: string) {
  return `${path.substring(0, 8)}-${path.substring(8, 4)}-${path.substring(
    12,
    4,
  )}-${path.substring(16, 4)}-${path.substring(20)}`;
}

console.log(idToUuid('81149e3a3d874d25b7082226dd72bfdd'));
const body = JSON.stringify({
  type: 'BlocksInSpace',
  // TODO: 検索結果 0 の理由、SpaceID と permission, host_permission が臭う ...
  query: 'go',
  spaceId: idToUuid('81149e3a3d874d25b7082226dd72bfdd'), // TODO: DO NOT COMMIT
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
  sort: 'Relevance',
  source: 'quick_find',
});

(async () => {
  const response = await fetch(NOTION_SEARCH_URL, {
    method: 'POST',
    body,
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const json = await response.json();
  const code = document.querySelector('code');
  if (code) {
    code.appendChild(document.createTextNode(JSON.stringify(json, null, 2)));
  }
})();
