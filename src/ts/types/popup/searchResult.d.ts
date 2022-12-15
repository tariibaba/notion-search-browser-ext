type Dir = {
  title: string;
};

type Item = {
  title: string;
  url: string;
  text?: string;
  icon: {
    type: valueOf<typeof import('../../popup/constants').ICON_TYPE>;
    value: string;
  };
  dirs: Dir[];
};

type SearchResult = {
  items: Item[];
  total: number;
};

type SearchResultCache = {
  query: string;
  searchResult: SearchResult;
};
