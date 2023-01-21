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
export const BLOCK_TYPE_DETAIL = {
  PAGE: {
    name: 'page',
  },
  COLLECTION_VIEW_PAGE: {
    name: 'collection_view_page',
    is_collection_view: true,
  },
  COLLECTION_VIEW: {
    name: 'collection_view',
    is_collection_view: true,
  },
  COLUMN_LIST: {
    name: 'column_list',
  },
  COLUMN: {
    name: 'column',
  },
  TEXT: {
    name: 'text',
  },
  TO_DO: {
    name: 'to_do',
  },
  SUB_HEADER: {
    name: 'sub_header',
  },
  TOGGLE: {
    name: 'toggle',
  },
  BULLETED_LIST: {
    name: 'bulleted_list',
  },
  // Also known as a "Template Button". The title is the button text, and the children are the templates to clone.
  // https://github.com/jamalex/notion-py/blob/master/notion/block.py#L504
  // Official: https://www.notion.so/help/template-buttons
  FACTORY: {
    name: 'factory',
  },
} as const satisfies {
  [key: string]: {
    name: string;
    is_collection_view?: boolean;
  };
};

export const BLOCK_TYPE = Object.fromEntries(
  Object.entries(BLOCK_TYPE_DETAIL).map((arr) => [arr[0], arr[1].name]),
);

export const BLOCK_TYPES_COLLECTION_VIEW = [
  BLOCK_TYPE.COLLECTION_VIEW_PAGE,
  BLOCK_TYPE.COLLECTION_VIEW,
] as const;
