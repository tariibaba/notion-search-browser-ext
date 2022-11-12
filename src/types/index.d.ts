type Res = {
  results: {
    id: string;
    highlight: { text: string; title?: string };
    highlightBlockId: string;
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
};

type Result = {
  title: string;
  text?: string;
  url: string;
  pageIcon?: string;
  parentsPath?: string;
};

type Results = Result[];
