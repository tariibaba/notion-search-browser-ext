import MergeableError from './MergeableError';

const PREFIX = 'Chrome storage error:';

export class ChromeStorageError extends MergeableError {}

export const storage = {
  get: async (key: string) => {
    try {
      return (await chrome.storage.local.get(key))[key];
    } catch (error) {
      throw new ChromeStorageError(`${PREFIX} get(${key}) failed`, error);
    }
  },
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  set: async (obj: any) => {
    try {
      await chrome.storage.local.set(obj);
    } catch (error) {
      throw new ChromeStorageError(
        `${PREFIX} set(${Object.keys(obj).join(',')}) failed`,
        error,
      );
    }
  },
  remove: async (key: string) => {
    try {
      return await chrome.storage.local.remove(key);
    } catch (error) {
      throw new ChromeStorageError(`${PREFIX} remove(${key}) failed`, error);
    }
  },
};
