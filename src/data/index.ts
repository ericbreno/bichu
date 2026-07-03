// Acesso tipado à base de animais. O JSON bruto é importado (resolveJsonModule)
// e tratado como Animal[]. Buscas usam normalizeText (acentos/caixa irrelevantes).

import rawData from "./animals.json";
import { normalizeText } from "@/lib/normalize";
import type { Animal } from "@/lib/game/types";

export const ANIMALS = rawData as unknown as Animal[];

export const ANIMALS_BY_ID: ReadonlyMap<string, Animal> = new Map(
  ANIMALS.map((a) => [a.id, a]),
);

/** Conta total (referência estável para sorteio/permutação). */
export const ANIMAL_COUNT = ANIMALS.length;

/** Busca um animal pelo id. */
export function getAnimal(id: string): Animal | undefined {
  return ANIMALS_BY_ID.get(id);
}

/**
 * Filtra animais por texto livre (nome ou aliases), insensível a acentos/caixa.
 * Retorna no máximo `limit` resultados, preservando a ordem da base.
 */
export function searchAnimals(query: string, limit = 6): Animal[] {
  const q = normalizeText(query);
  if (!q) return [];
  return ANIMALS.filter((a) => {
    if (normalizeText(a.nome).includes(q)) return true;
    return a.aliases?.some((alias) => normalizeText(alias).includes(q)) ?? false;
  }).slice(0, limit);
}
