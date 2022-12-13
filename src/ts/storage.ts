import CustomError from './CustomError';

class ChromeStorageError extends CustomError {
  constructor(message: string, error: unknown) {
    super(message, error);
    this.name = 'ChromeStorageError'; // minify されると型名がかるので、これは自動取得してはいけない
  }
}

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
