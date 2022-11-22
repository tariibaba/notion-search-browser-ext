export const SEARCH_LIMIT = 50;
export const STORAGE_KEY = 'last-searched';
export const MIN_QUERY_LENGTH = 1;
export const STRANGE_NOTION_TAG = 'gzkNfoUU';

export const FiltersBy = {
  TITLE_ONLY: 'titleOnly',
} as const;

export const SortBy = {
  RELEVANCE: 'relevance',
  LASTEDITED: 'lastEdited',
  CREATED: 'created',
} as const;
