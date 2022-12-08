type FiltersBy = {
  [key in valueOf<typeof import('../../popup/constants').FILTERS_BY>]?: boolean;
};
