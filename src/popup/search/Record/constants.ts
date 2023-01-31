/*
  table type | block type
  -----------|----------------------
  collection |
  block -----┬- page
             ├- collection_view_page
             ├- collection_view
             └- ...
*/

// 新しい type はここに追記するだけでは駄目で、他に
//  - factory.ts の createRecord の分岐を追加
//  - 下の CAN_BE_DIR
//  - apiResponse.d.ts
export const TABLE_TYPE = {
  WORKSPACE: 'space', // parent only
  BLOCK: 'block',
  COLLECTION: 'collection', // parent only
  TEAM: 'team', // parent only
} as const;

// NOTE: ここに追加したら、テストも追加
// データ値をキーにすると、データ値が foo-bar みたいな値の場合にキーとして扱えないので
// name 用の object と detail 用の object は分けるのが吉。
export const BLOCK_TYPE = {
  PAGE: 'page',
  COLLECTION_VIEW_PAGE: 'collection_view_page',
  COLLECTION_VIEW: 'collection_view',
  COLUMN_LIST: 'column_list', // parent only
  COLUMN: 'column', // parent only
  TEXT: 'text',
  // TO_DO: 'to_do',
  // SUB_HEADER: 'sub_header',
  TOGGLE: 'toggle',
  // BULLETED_LIST: 'bulleted_list',
  // // Also known as a "Template Button".
  // // The title is the button text, and the children are the templates to clone.
  // // https://github.com/jamalex/notion-py/blob/master/notion/block.py#L504
  // // Official: https://www.notion.so/help/template-buttons
  // FACTORY: 'factory',
  // TRANSCLUSION_CONTAINER: 'transclusion_container',
} as const;

export const BLOCK_TYPE_MAP = Object.fromEntries(
  Object.entries(BLOCK_TYPE).map((arr) => [arr[1], true]),
) as {
  [key in valueOf<typeof BLOCK_TYPE>]: true;
};

// types の array を作るのが容易なので、topic ごとに独立した object を作る。
export const BLOCK_TYPE_IS_COLLECTION_VIEW = {
  [BLOCK_TYPE.COLLECTION_VIEW_PAGE]: true,
  [BLOCK_TYPE.COLLECTION_VIEW]: true,
} as {
  [key in valueOf<typeof BLOCK_TYPE>]?: boolean;
};
