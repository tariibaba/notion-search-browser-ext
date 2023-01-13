// TODO: ファイル分割
// ========================================
// search options
// ========================================
export const SEARCH_LIMIT = 50;
export const MATCH_TAG = 'gzkNfoUU';

export const SORT_BY = {
  RELEVANCE: 'relevance',
  LAST_EDITED: 'last-edited',
  CREATED: 'created',
} as const;

// ========================================
// API response
// ========================================

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
export const BLOCK_TYPE = {
  PAGE: 'page',
  COLLECTION_VIEW_PAGE: 'collection_view_page',
  COLLECTION_VIEW: 'collection_view',
  COLUMN_LIST: 'column_list',
  COLUMN: 'column',
  TEXT: 'text',
  TO_DO: 'to_do',
  SUB_HEADER: 'sub_header',
  TOGGLE: 'toggle',
  BULLETED_LIST: 'bulleted_list',
  // Also known as a "Template Button". The title is the button text, and the children are the templates to clone.
  // https://github.com/jamalex/notion-py/blob/master/notion/block.py#L504
  // Official: https://www.notion.so/help/template-buttons
  FACTORY: 'factory',
} as const;

export const BLOCK_TYPES_COLLECTION_VIEW = [
  BLOCK_TYPE.COLLECTION_VIEW_PAGE,
  BLOCK_TYPE.COLLECTION_VIEW,
] as const;

// ========================================
// Others
// ========================================

export const STORAGE_KEY = {
  LAST_SEARCHED: 'LAST_SEARCHED',
} as const;

export const ICON_TYPE = {
  IMAGE: 'image',
  EMOJI: 'emoji',
} as const;
