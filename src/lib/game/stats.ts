// Estatísticas acumuladas do jogador. Funções puras: reducer `recordResult` +
// derivadores (taxa de acerto, média de tentativas). A sequência (streak) só
// avança/zera no modo diário, comparando dias consecutivos no fuso BRT.

import { diffBrtDays } from "@/lib/date";
import type { GameMode } from "./types";

export interface Stats {
  played: number;
  wins: number;
  losses: number;
  /** Distribuição de tentativas até vencer: { [tentativas]: vezes }. */
  distribution: Record<number, number>;
  currentStreak: number;
  maxStreak: number;
  /** Chave de data (YYYY-MM-DD BRT) do último diário resolvido. */
  lastDailyDateKey: string | null;
}

export const EMPTY_STATS: Stats = {
  played: 0,
  wins: 0,
  losses: 0,
  distribution: {},
  currentStreak: 0,
  maxStreak: 0,
  lastDailyDateKey: null,
};

export interface ResultInput {
  mode: GameMode;
  won: boolean;
  tries: number;
  /** Apenas modo diário: chave de data (YYYY-MM-DD BRT) da partida. */
  dailyDateKey?: string;
}

/** Devolve um novo Stats com o resultado registrado (imutável). */
export function recordResult(stats: Stats, result: ResultInput): Stats {
  const next: Stats = {
    ...stats,
    distribution: { ...stats.distribution },
  };

  next.played += 1;
  if (result.won) {
    next.wins += 1;
    next.distribution[result.tries] = (next.distribution[result.tries] ?? 0) + 1;
  } else {
    next.losses += 1;
  }

  // Sequência de dias consecutivos — exclusiva do Diário.
  if (result.mode === "daily" && result.dailyDateKey) {
    const prev = stats.lastDailyDateKey;
    if (result.won) {
      const consecutive = prev ? diffBrtDays(prev, result.dailyDateKey) === 1 : false;
      next.currentStreak = prev ? (consecutive ? stats.currentStreak + 1 : 1) : 1;
      next.maxStreak = Math.max(next.maxStreak, next.currentStreak);
    } else {
      next.currentStreak = 0;
    }
    next.lastDailyDateKey = result.dailyDateKey;
  }

  return next;
}

/** Média de tentativas nas vitórias (0 se nenhuma vitória). */
export function averageTries(stats: Stats): number {
  const entries = Object.entries(stats.distribution);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  if (total === 0) return 0;
  const weighted = entries.reduce((sum, [tries, count]) => sum + Number(tries) * count, 0);
  return weighted / total;
}

/** Taxa de acerto em [0, 1] (0 se nenhuma partida). */
export function winRate(stats: Stats): number {
  return stats.played === 0 ? 0 : stats.wins / stats.played;
}
