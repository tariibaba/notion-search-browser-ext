import axios, { AxiosError } from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { NOTION_HOST } from './constants';
import { errorToString, toUpperCaseFirst } from './utils';

const API_BASE_URL = `${NOTION_HOST}/api/v3`;
const CACHE_TIME = 1 * 60 * 1_000;
const TIMEOUT = 10_000;
const STATUS_CODE_UNAUTHORIZED = 401;

const AxiosInstance = setupCache(
  axios.create({
    baseURL: API_BASE_URL,
    timeout: TIMEOUT,
  }),
  {
    ttl: CACHE_TIME,
    methods: ['get', 'post'],
  },
);

class HttpRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HttpRequestError';
  }
}

// TODO: Test
AxiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    let message: string;
    if (error instanceof AxiosError) {
      message = toUpperCaseFirst(
        error.response?.data?.message || error.message,
      );
      if (error.response?.status === STATUS_CODE_UNAUTHORIZED) {
        // TODO: 国際化
        if (confirm('You must log in to Notion.\nGo to Notion and log in?')) {
          window.open(`${NOTION_HOST}/login`);
        }
        return Promise.reject(new Error(message));
      }
    } else {
      message = errorToString(error);
    }
    return Promise.reject(new HttpRequestError(message));
  },
);

export { AxiosInstance as axios };

// ========================================
// Utils
// ========================================
