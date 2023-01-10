// utils
type valueOf<T> = T[keyof T];
type SetStateArg<T> = T | ((latestValue: T) => T);

type Workspace = {
  id: string;
  name: string;
};

declare const IS_SENTRY_ENABLED: boolean;
declare const SETNRY_ARGS: {
  dsn: string;
  release: string;
};
