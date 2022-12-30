// utils
type valueOf<T> = T[keyof T];

type Workspace = {
  id: string;
  name: string;
};

declare const SENTRY_DSN: string;
declare const VERSION: string;
