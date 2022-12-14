// ========================================
// search options
// ========================================
export const SEARCH_LIMIT = 50;
export const MATCH_TAG = 'gzkNfoUU';

export const FILTERS_BY = {
  ONLY_TITLE: 'ONLY_TITLE',
} as const;

export const SORT_BY = {
  RELEVANCE: 'RELEVANCE',
  LAST_EDITED: 'LAST_EDITED',
  CREATED: 'CREATED',
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

export const TABLE_TYPE = {
  WORKSPACE: 'space',
  BLOCK: 'block',
  COLLECTION: 'collection',
} as const;

export const BLOCK_TYPE = {
  PAGE: 'page',
  COLLECTION_VIEW_PAGE: 'collection_view_page',
  COLLECTION_VIEW: 'collection_view',
  COLUMN_LIST: 'column_list',
  COLUMN: 'column',
} as const;

export const CAN_BE_DIR: {
  COLLECTION: boolean;
  BLOCK: {
    [key in valueOf<typeof BLOCK_TYPE>]: boolean;
  };
} = {
  COLLECTION: false,
  BLOCK: {
    [BLOCK_TYPE.PAGE]: true,
    [BLOCK_TYPE.COLLECTION_VIEW_PAGE]: true,
    [BLOCK_TYPE.COLLECTION_VIEW]: true,
    [BLOCK_TYPE.COLUMN_LIST]: false,
    [BLOCK_TYPE.COLUMN]: false,
  },
};

// ========================================
// Others
// ========================================

export const STORAGE_KEY = {
  LAST_SEARCHED: 'LAST_SEARCHED',
} as const;

export const ICON_TYPE = {
  IMAGE: 'IMAGE',
  EMOJI: 'EMOJI',
} as const;
