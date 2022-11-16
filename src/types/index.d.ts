type valueOf<T> = T[keyof T]; // util

type ApiResonse = {
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

type SearchError = valueOf<typeof import('../errors').SEARCH_ERROR> | null;

type SearchResults = {
  items: Items;
  total: number;
  error: SearchError;
};

type StorageData = {
  query: string;
  results: SearchResults;
};
