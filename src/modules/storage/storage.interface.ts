// Abstração sobre armazenamento persistente para que o backend possa mudar
// (ex.: uma API de sync) sem tocar na UI. Implementação atual: localStorage.
export interface StorageProvider {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}
