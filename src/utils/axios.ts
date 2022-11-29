import axios, { AxiosError } from 'axios';
import { setupCache } from 'axios-cache-adapter';
import { NOTION_HOST } from '../constants';

const API_BASE_URL = `${NOTION_HOST}/api/v3`;
const CACHE_TIME = 15 * 60 * 1_000;
const TIMEOUT = 10_000;
const STATUS_CODE_UNAUTHORIZED = 401;

const AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  adapter: setupCache({
    maxAge: CACHE_TIME,
    exclude: { methods: [] },
  }).adapter,
  timeout: TIMEOUT,
});

AxiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    let message = 'HTTP Request error. ';
    if (error instanceof AxiosError) {
      message += toUpperCaseFirst(
        error.response?.data?.message || error.message,
      );
      if (error.response?.status === STATUS_CODE_UNAUTHORIZED) {
        // TODO: 国際化
        if (confirm('You must log in to Notion.\nGo to Notion and log in?')) {
          window.open(`${NOTION_HOST}/login`);
        }
        const e = new Error(message);
        console.trace(e);
        return Promise.reject(e);
      }
    } else if (error instanceof Error) {
      message += toUpperCaseFirst(error.message);
    } else {
      message += toUpperCaseFirst(error + '');
    }
    alert(message);

    const e = new Error(message);
    console.trace(e);
    return Promise.reject(e);
  },
);

export { AxiosInstance as axios };

// ========================================
// Utils
// ========================================

function toUpperCaseFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
