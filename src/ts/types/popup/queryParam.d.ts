type SetQueryParam<T> = (
  newValue: SetStateArg<T | null | undefined>,
  updateType?: import('use-query-params').UrlUpdateType | undefined,
) => void;
