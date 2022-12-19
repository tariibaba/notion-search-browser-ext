let store = {};
type Key = keyof typeof store;

// 全部の引数パターン実装するのは果てしなくだるいので、spy は諦めた

export const storage = {
  clear: async () => {
    store = {};
  },
  // get multi は今のところ使ってないので未実装
  get: async (key?: string) => {
    return key === undefined
      ? store
      : {
          [key]: store[key as Key] ?? {},
        };
  },
  remove: async (key: string) => {
    delete store[key as Key];
  },
  set: async (value: object) => {
    store = { ...store, ...value };
  },
};
