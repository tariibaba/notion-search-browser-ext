// NOTE: このファイルに仕様のメモはしない。 するなら constants.ts に

declare namespace SearchApi {
  type TableType = valueOf<typeof import('../../popup/constants').TABLE_TYPE>;
  type TableTypeWithoutWorkspace = Exclude<
    TableType,
    typeof import('../../popup/constants').TABLE_TYPE.WORKSPACE
  >;

  type BlockType = valueOf<typeof import('../../popup/constants').BLOCK_TYPE>;

  type Item = {
    id: string;
    highlight?: {
      text?: string;
    };
    highlightBlockId?: string;
  };

  type _RecordBase = {
    id: string;
    parent_id: string;
    parent_table: TableType;
  };

  type Collection = _RecordBase & {
    // こちらは探せど探せど size も深さも 1 の配列しか無いので、RecordBase と合わせない
    name?: string[][];
    icon?: string;
  };

  type Team = _RecordBase & {
    name: string;
    icon?: string; // not used
  };

  type _BlockBase = _RecordBase & {
    format?: {
      page_icon?: string;
    };
    properties?: {
      title: (string | string[][])[][];
    };
  };

  type _BlockTypeCollectionView =
    typeof import('../../popup/constants').BLOCK_TYPES_COLLECTION_VIEW[number];

  type BlockNotCollectionView = _BlockBase & {
    type: Exclude<BlockType, _BlockTypeCollectionView>;
  };

  type BlockCollectionView = _BlockBase & {
    type: _BlockTypeCollectionView;
    // 無い場合もある（その場合はアイコン取得不可。。。）
    // ex) https://www.notion.so/cside/63e92fc56afe463386ea800f82e37ce8
    collection_id?: string;
  };

  type Block = BlockCollectionView | BlockNotCollectionView;

  type Record = Block | Collection | Team;

  type RecordMapValue<T> = {
    [id: string]: {
      value: T;
    };
  };
  type RecordMap = {
    // API に type: BlocksInSpaceと要求してるので、欠落することはない
    block: RecordMapValue<Block>;
    collection?: RecordMapValue<Collection>;
    team?: RecordMapValue<Team>;
  };
}

type SearchApiResponse = {
  results: SearchApi.Item[];
  recordMap: SearchApi.RecordMap;
  total: number;
};

type GetWorkspacesApiResponse = {
  [userId: string]: {
    space: {
      [spaceId: string]: {
        value: {
          name: string;
        };
      };
    };
    space_view: {
      [id: string]: {
        value: {
          private_pages: string[];
          space_id: string; // TODO: userId を使う実装になったら不要になる
        };
      };
    };
  };
};
