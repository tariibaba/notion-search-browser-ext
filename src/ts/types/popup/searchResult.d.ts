type Dir = {
  title: string;
  record: RecordBase;
  tableType: TableTypeWithoutWorkspace;
};

type Item = {
  title: string;
  url: string;
  text?: string;
  icon: {
    type: valueOf<typeof import('../../popup/constants').ICON_TYPE>;
    value: string;
    className?: string;
  };
  dirs: Dir[];
  record: RecordBase;
  tableType: TableTypeWithoutWorkspace;
};

type SearchResult = {
  items: Item[];
  total: number;
};

type SearchResultCache = {
  query: string;
  searchResult: SearchResult;
};
