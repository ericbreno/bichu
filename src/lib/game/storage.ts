// Acesso tipado ao estado do jogo via StorageProvider. Mantém a UI isolada das
// chaves/serialização e garante tipos consistentes entre leitores/escritores.

import { STORAGE_KEYS } from "@/lib/keys";
import type { StorageProvider } from "@/modules/storage/storage.interface";
import { EMPTY_STATS, type Stats } from "./stats";
import type { GameStatus } from "./types";

export interface DailyState {
  /** Chave de data (YYYY-MM-DD BRT) — define se o estado ainda é válido. */
  dateKey: string;
  /** ids dos animais já chutados, em ordem. */
  attempts: string[];
  status: GameStatus;
}

export interface InfiniteState {
  answerId: string;
  attempts: string[];
  status: GameStatus;
}

export function loadDaily(storage: StorageProvider): DailyState | null {
  return storage.get<DailyState>(STORAGE_KEYS.daily);
}

export function saveDaily(storage: StorageProvider, state: DailyState): void {
  storage.set(STORAGE_KEYS.daily, state);
}

export function loadInfinite(storage: StorageProvider): InfiniteState | null {
  return storage.get<InfiniteState>(STORAGE_KEYS.infinite);
}

export function saveInfinite(storage: StorageProvider, state: InfiniteState): void {
  storage.set(STORAGE_KEYS.infinite, state);
}

export function loadStats(storage: StorageProvider): Stats {
  return storage.get<Stats>(STORAGE_KEYS.stats) ?? EMPTY_STATS;
}

export function saveStats(storage: StorageProvider, stats: Stats): void {
  storage.set(STORAGE_KEYS.stats, stats);
}
