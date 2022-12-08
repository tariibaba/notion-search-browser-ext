type ResItem = {
  id: string;
  highlight?: {
    text: string;
    title?: string;
  };
  highlightBlockId?: string;
};

type RecordBase<Value> = {
  [id: string]: {
    value: Value;
  };
};

// TODO: 型ガード化したら RecordValueBase 内で宣言して良さそう
type TableType = valueOf<typeof import('../../popup/constants').TABLE_TYPE>;

type RecordValueBase = {
  parent_id?: string;
  format?: {
    page_icon?: string;
  };
  parent_table: TableType;
  properties?: {
    title: string[][];
  };
};

// collection view page を parent に持つ database 。
// https://notion.so/${id} してもページは見れない。
// ( Web で見るなら collection view page で見る)
// ex) 4c3edd73-64cb-46b7-9f15-86458800c192
//     0351f04a-0e77-4164-b12b-614f75ecf9c7
type Collection = RecordValueBase & {
  name?: string[][];
};

type BlockPage = RecordValueBase & {
  type: typeof import('../../popup/constants').BLOCK_TYPE.PAGE;
};
// database の parent となるページ
// ex) https://www.notion.so/ecc6660b01854c34af95907a7bf77548
//     https://www.notion.so/4897c80a8baa4c4d92617e1f627121bf
type BlockCollectionViewPage = RecordValueBase & {
  type: typeof import('../../popup/constants').BLOCK_TYPE.COLLECTION_VIEW_PAGE;
  collection_id?: string; // FIXME view page だけ作って database 未登録の場合に存在しない
};

// https://www.notion.so/cside/b5f75eedb90340aeba67f4265517c87c?v=461c4934d00a4d51b35a5537fe938d85
type BlockCollectionView = RecordValueBase & {
  type: typeof import('../../popup/constants').BLOCK_TYPE.COLLECTION_VIEW;
};

type Block = BlockPage | BlockCollectionViewPage | BlockCollectionView;

type SearchApiResponse = {
  results: ResItem[];
  recordMap: {
    // TODO 検索結果 0 件のときは無いけど ...
    // それ以外のときに欠落するケースあるのだろうか？ (検索結果が全部 collection とか...)
    // カレンダーだけのページ作って検証するか ... 。
    block: RecordBase<Block>;
    collection?: RecordBase<Collection>;
  };
  total: number;
};
