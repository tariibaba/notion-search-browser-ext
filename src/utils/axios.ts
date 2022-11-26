import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import { NOTION_HOST } from '../popup/constants';

const CACHE_TIME = 15 * 60 * 1_000;
const TIMEOUT = 5_000;

const AxiosInstance = axios.create({
  baseURL: NOTION_HOST,
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
