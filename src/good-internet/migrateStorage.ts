// One-time migration from the pre-rebrand `kept.*` localStorage keys to `goodinternet.*`.
// Copies each old key only if the new key isn't set yet, then removes the old one.
const OLD_PREFIX = 'kept' + '.';
const NEW_PREFIX = 'goodinternet.';

export function migrateLegacyStorage(): void {
  try {
    const oldKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(OLD_PREFIX)) oldKeys.push(key);
    }
    for (const key of oldKeys) {
      const next = NEW_PREFIX + key.slice(OLD_PREFIX.length);
      const value = localStorage.getItem(key);
      if (value !== null && localStorage.getItem(next) === null) localStorage.setItem(next, value);
      localStorage.removeItem(key);
    }
  } catch {
    // Storage blocked: nothing to migrate.
  }
}

migrateLegacyStorage();
