import '@testing-library/jest-dom';
import { chrome } from 'jest-chrome';
import { storage } from './chrome/storage';

Object.assign(global, { chrome: chrome });

beforeAll(() => {
  // Object のインスタンスは spy できないので
  global.chrome.storage.local = storage as chrome.storage.LocalStorageArea;

  jest
    .spyOn(chrome.runtime, 'getURL')
    .mockImplementation((str: string) => `chrome://<extension-id>/${str}`);
});
