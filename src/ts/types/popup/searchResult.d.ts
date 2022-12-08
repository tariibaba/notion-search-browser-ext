type Item = {
  title: string;
  url: string;
  text?: string;
  pageIcon?: {
    type: valueOf<typeof import('../../popup/constants').ICON_TYPE>;
    value: string;
  };
  parentsPath?: string;
};

type SearchResult = {
  items: Item[];
  total: number;
};

type SearchResultCache = {
  query: string;
  searchResult: SearchResult;
};
