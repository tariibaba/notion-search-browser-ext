class ChromeStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChromeStorageError';
  }
}

export const storage = {
  get: async (key: string) => {
    try {
      return (await chrome.storage.local.get(key))[key];
    } catch (error) {
      throw new ChromeStorageError(
        `chrome.storage.local.get(${key}) failed. error: ${error}`,
      );
    }
  },
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  set: async (obj: any) => {
    try {
      return await chrome.storage.local.set(obj);
    } catch (error) {
      throw new ChromeStorageError(
        `chrome.storage.local.set(${JSON.stringify(
          obj,
        )}) failed. error: ${error}`,
      );
    }
  },
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  remove: async (key: string) => {
    try {
      return await chrome.storage.local.remove(key);
    } catch (error) {
      throw new Error(
        `chrome.storage.local.remove(${key}) failed. error: ${error}`,
      );
    }
  },
};
