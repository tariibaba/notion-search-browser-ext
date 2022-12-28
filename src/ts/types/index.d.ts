type valueOf<T> = T[keyof T]; // util

type Workspace = {
  id: string;
  name: string;
};

declare const SENTRY_DSN: string;
declare const VERSION: string;
