type valueOf<T> = T[keyof T]; // util

type ApiResponse = {
  results: {
    id: string;
    highlight?: {
      text: string;
      title?: string;
    };
    highlightBlockId?: string;
    analytics?: object;
  }[];
  recordMap: {
    block: {
      [id: string]: {
        value: {
          properties: {
            title: string[][];
          };
          parent_id?: string;
          format?: {
            page_icon?: string;
          };
        };
      };
    };
  };
  total: number;
};

type IconType = valueOf<typeof import('../popup/constants').ICON_TYPE>;

type Item = {
  title: string;
  url: string;
  text?: string;
  pageIcon?: {
    type: IconType;
    value: string;
  };
  parentsPath?: string;
};

type Items = Item[];

type SearchResult = {
  items: Items;
  total: number;
};

type StorageData = {
  query: string;
  searchResult: SearchResult;
};

type FiltersBy = {
  [key in valueOf<typeof import('../popup/constants').FiltersBy>]?: boolean;
};
