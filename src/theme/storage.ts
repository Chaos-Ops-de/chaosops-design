export interface ThemeStorage {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
}

export const memoryStorage: ThemeStorage = (() => {
  const store = new Map<string, string>();
  return {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => { store.set(k, v); },
  };
})();

export function createLocalStorageAdapter(): ThemeStorage {
  const canUse = typeof globalThis !== 'undefined' && typeof (globalThis as any).localStorage !== 'undefined';
  if (!canUse) return memoryStorage;
  const ls: Storage = (globalThis as any).localStorage;
  return {
    getItem: (k) => {
      try { return ls.getItem(k); } catch { return null; }
    },
    setItem: (k, v) => {
      try { ls.setItem(k, v); } catch { /* private mode / quota */ }
    },
  };
}
