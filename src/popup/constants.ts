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

// default is true
export const CAN_BE_DIR = {
  COLLECTION: false,
  TEAM: true,
  BLOCK: {
    [BLOCK_TYPE.PAGE]: true,
    [BLOCK_TYPE.COLLECTION_VIEW_PAGE]: true,
    [BLOCK_TYPE.COLLECTION_VIEW]: true,
    [BLOCK_TYPE.COLUMN_LIST]: false,
    [BLOCK_TYPE.COLUMN]: false,
    // 下記は dir にならなくていい。親が必ず block だし。というか子を持てないだろう。
    [BLOCK_TYPE.TEXT]: false,
    [BLOCK_TYPE.TO_DO]: false,
    [BLOCK_TYPE.SUB_HEADER]: false,
    [BLOCK_TYPE.TOGGLE]: false,
    [BLOCK_TYPE.BULLETED_LIST]: false,
    [BLOCK_TYPE.FACTORY]: false, // これ何だろう...。
  },
} as const satisfies {
  COLLECTION: boolean;
  TEAM: boolean;
  BLOCK: {
    [key in valueOf<typeof BLOCK_TYPE>]: boolean;
  };
};

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
