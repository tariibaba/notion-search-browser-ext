import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import { NOTION_HOST } from '../constants';

const API_BASE_URL = `${NOTION_HOST}/api/v3`;
const CACHE_TIME = 15 * 60 * 1_000;
const TIMEOUT = 5_000;

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
    error = new Error(
      `HTTP Request error. ` +
        (error instanceof Error && error.name === 'AxiosError'
          ? error.message
          : error),
    );
    console.trace(error);
    return Promise.reject(error);
  },
);

export { AxiosInstance as axios };
