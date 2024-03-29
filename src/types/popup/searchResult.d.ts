type Dir = {
  title: string;
  block: SearchApi.Block; // workspace, collection は dir から除外してるので
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
  // type: BlocksInSpace と API に指定している限り workspace, collection は含まれないため
  block: SearchApi.Block;
};

type SearchResult = {
  items: Item[];
  total: number;
};

type SearchResultCache = {
  query: string;
  searchResult: SearchResult;
};
