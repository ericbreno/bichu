// Sorteio determinístico do Animal do Dia. O mesmo dia (no fuso BRT) mapeia para
// o mesmo animal para todos os jogadores. Reaproveita o RNG determinístico da lib.

import { ANIMALS, ANIMAL_COUNT } from "@/data";
import { createPermutation, hashSeed } from "@/lib/rng";
import { brtDateString, brtDayNumber } from "@/lib/date";
import type { Animal } from "./types";

// Versão da semente: altere para reembaralhar a sequência do Diário.
const DAILY_SEED = "bichu-daily-v1";

// Permutação estável dos índices; calculada uma única vez por sessão.
let permutationCache: number[] | null = null;
function dailyPermutation(): number[] {
  if (!permutationCache) {
    permutationCache = createPermutation(ANIMAL_COUNT, hashSeed(DAILY_SEED));
  }
  return permutationCache;
}

/** Animal correspondente ao dia (BRT) do instante dado. */
export function getDailyAnimal(date = new Date()): Animal {
  const n = brtDayNumber(date);
  const idx = ((n - 1) % ANIMAL_COUNT + ANIMAL_COUNT) % ANIMAL_COUNT;
  return ANIMALS[dailyPermutation()[idx]];
}

/** Info completa do dia: número (#N), chave de data (YYYY-MM-DD BRT) e resposta. */
export function getDailyInfo(date = new Date()) {
  return {
    dayNumber: brtDayNumber(date),
    dateKey: brtDateString(date),
    answer: getDailyAnimal(date),
  };
}
