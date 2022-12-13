export const toUpperCaseFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const errorToString = (error: unknown) =>
  error instanceof Error ? error.message : error + '';
