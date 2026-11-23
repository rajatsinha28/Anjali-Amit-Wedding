export const storageKeys = {
  introOpened: "intro.opened",
  dateRevealed: "dateRevealed",
  musicEnabled: "music.enabled",
  language: "lang",
} as const;

export interface SafeStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  clear(): void;
}

export function createSafeStorage(storage: Storage | null): SafeStorage {
  const memory = new Map<string, string>();
  const operate = (action: () => void): boolean => {
    try {
      action();
      return true;
    } catch {
      return false;
    }
  };

  return {
    get(key) {
      try {
        return storage?.getItem(key) ?? memory.get(key) ?? null;
      } catch {
        return memory.get(key) ?? null;
      }
    },
    set(key, value) {
      memory.set(key, value);
      if (storage) operate(() => storage.setItem(key, value));
    },
    remove(key) {
      memory.delete(key);
      if (storage) operate(() => storage.removeItem(key));
    },
    clear() {
      memory.clear();
      if (storage) operate(() => storage.clear());
    },
  };
}

function resolveStorage(kind: "localStorage" | "sessionStorage"): Storage | null {
  try {
    return typeof window === "undefined" ? null : window[kind];
  } catch {
    return null;
  }
}

export const safeLocalStorage = createSafeStorage(resolveStorage("localStorage"));
export const safeSessionStorage = createSafeStorage(resolveStorage("sessionStorage"));
