export const NOTION_HOST = 'https://www.notion.so';
export const SEARCH_LIMIT = 50;
export const MATCH_TAG = 'gzkNfoUU';

export const FiltersBy = {
  TITLE_ONLY: 'TITLE_ONLY',
} as const;

export const SortBy = {
  RELEVANCE: 'RELEVANCE',
  LASTEDITED: 'LAST_EDITED',
  CREATED: 'CREATED',
} as const;

export const STORAGE_KEY = {
  LAST_SEARCHED: 'LAST_SEARCHED',
  SPACE_ID: 'SPACE_ID',
} as const;

export const MESSAGE_TYPE = {
  ADD_SPACE_ID: 'ADD_SPACE_ID',
} as const;

export const ICON_TYPE = {
  IMAGE: 'IMAGE',
  EMOJI: 'EMOJI',
} as const;
