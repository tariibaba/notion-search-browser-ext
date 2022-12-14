// NOTE: このファイルに仕様のメモはしない。 するなら constants.ts に

type ResItem = {
  id: string;
  highlight?: {
    text: string;
  };
  highlightBlockId?: string;
};

type TableType = valueOf<typeof import('../../popup/constants').TABLE_TYPE>;
type BlockType = valueOf<typeof import('../../popup/constants').BLOCK_TYPE>;

type RecordValueBase = {
  // block type: space 出ない限り必ず存在する
  parent_id: string;
  parent_table: TableType;
  format?: {
    page_icon?: string;
  };
  properties?: {
    title: string[][];
  };
};

type Collection = RecordValueBase & {
  name?: string[][];
  icon?: string;
};

type BlockBase = RecordValueBase & {
  format?: {
    page_icon?: string;
  };
};

type BLOCK_TYPE_COLLECTION_VIEW_PAGE =
  typeof import('../../popup/constants').BLOCK_TYPE.COLLECTION_VIEW_PAGE;
type BLOCK_TYPE_COLLECTION_VIEW =
  typeof import('../../popup/constants').BLOCK_TYPE.COLLECTION_VIEW;

type Block = BlockBase &
  (
    | {
        type: Exclude<
          BlockType,
          BLOCK_TYPE_COLLECTION_VIEW_PAGE | BLOCK_TYPE_COLLECTION_VIEW
        >;
      }
    | {
        type: BLOCK_TYPE_COLLECTION_VIEW_PAGE | BLOCK_TYPE_COLLECTION_VIEW;
        // 無い場合もある（その場合はアイコン取得不可。。。）
        // ex) https://www.notion.so/cside/63e92fc56afe463386ea800f82e37ce8
        collection_id?: string;
      }
  );

type RecordMap = {
  // API に type: BlocksInSpace と要求してるので、欠落することはない
  block: {
    [id: string]: {
      value: Block;
    };
  };
  collection?: {
    [id: string]: {
      value: Collection;
    };
  };
};

type SearchApiResponse = {
  results: ResItem[];
  recordMap: RecordMap;
  total: number;
};
