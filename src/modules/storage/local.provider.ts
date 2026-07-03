import type { StorageProvider } from "./storage.interface";

// Adapter de localStorage. Protegido para SSR e best-effort: nunca lança, então
// modo privado ou cota excedida degradam graciosamente.
export class LocalStorageProvider implements StorageProvider {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Cota excedida ou modo privado: persistência best-effort, ignora erros.
    }
  }

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignora
    }
  }
}

export const localStorageProvider = new LocalStorageProvider();
