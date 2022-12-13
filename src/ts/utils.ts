import { AxiosError } from 'axios';
import { NOTION_HOST } from './constants';
import { ChromeStorageError } from './storage';

export const alertError = (alertMessage: string, error: unknown) => {
  let unauthroized = false;
  let errorMessage: string;

  if (error instanceof ChromeStorageError) {
    errorMessage = 'Chrome storage error: ' + error.message;
  } else if (error instanceof AxiosError) {
    errorMessage =
      'HTTP request error: ' + (error.response?.data?.message || error.message);
    if (error.response?.status === 401) {
      unauthroized = true;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = JSON.stringify(error);
  }

  if (unauthroized) {
    if (confirm('You must log in to Notion.\nGo to Notion and log in?')) {
      window.open(`${NOTION_HOST}/login`);
    }
  } else {
    alert(`${alertMessage}\n(${errorMessage})`);
  }
};
