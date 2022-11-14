type Res = {
  results: {
    id: string;
    highlight?: { text: string; title?: string };
    highlightBlockId?: string;
    analytics?: object;
  }[];
  recordMap: {
    block: {
      [id: string]: {
        value: {
          properties: { title: string[][] };
          parent_id?: string;
          format?: { page_icon?: string };
        };
      };
    };
  };
  total: number;
};

type Item = {
  title: string;
  url: string;
  text?: string;
  pageIcon?: string;
  parentsPath?: string;
};

type Items = Item[];

type SearchError =
  | 'MIN_QUERY_LENGTH'
  | 'SAME_QUERY'
  | 'HTTP_REQUEST_FAILED'
  | null;

type SearchResults = {
  items: Items;
  total: number;
  error: SearchError;
};

type StorageData = {
  query: string;
  results: SearchResults;
};
