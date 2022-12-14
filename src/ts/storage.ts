import MergeableError from './MergeableError';

export class ChromeStorageError extends MergeableError {}

export const storage = {
  get: async (key: string) => {
    try {
      return (await chrome.storage.local.get(key))[key];
    } catch (error) {
      throw new ChromeStorageError(`get(${key}) failed`, error);
    }
  },
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  set: async (obj: any) => {
    try {
      return await chrome.storage.local.set(obj);
    } catch (error) {
      throw new ChromeStorageError(`set(${JSON.stringify(obj)}) failed`, error);
    }
  },
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  remove: async (key: string) => {
    try {
      return await chrome.storage.local.remove(key);
    } catch (error) {
      throw new ChromeStorageError(`remove(${key}) failed`, error);
    }
  },
};
