export const storage = {
  local: {
    set: (key: string, value: unknown) => {
      localStorage.setItem(key, JSON.stringify(value));
    },

    get: (key: string) => {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },

    remove: (key: string) => {
      localStorage.removeItem(key);
    },
  },
  session: {
    set: (key: string, value: unknown) => {
      sessionStorage.setItem(key, JSON.stringify(value));
    },

    get: (key: string) => {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },

    remove: (key: string) => {
      sessionStorage.removeItem(key);
    },
  },
};
