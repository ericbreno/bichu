// Monta o texto de compartilhamento no estilo Termo: um grid de emojis com uma
// linha por tentativa, usando o subconjunto canônico de colunas.

import { SHARE_COLUMN_KEYS, toneToEmoji } from "./compare";
import type { Animal, GameMode, GuessRow } from "./types";

/** Emojis de uma tentativa (uma coluna por chave em SHARE_COLUMN_KEYS). */
export function rowToEmojis(row: GuessRow): string {
  const byKey = new Map(row.cells.map((c) => [c.key, c.tone]));
  return SHARE_COLUMN_KEYS.map((key) =>
    toneToEmoji(byKey.get(key as keyof Animal) ?? "neutral"),
  ).join("");
}

export interface ShareInput {
  mode: GameMode;
  /** Número do dia (apenas modo diário). */
  dayNumber?: number;
  rows: GuessRow[];
  domain: string;
}

/** Texto final copiável para a área de transferência. */
export function buildShareText({ mode, dayNumber, rows, domain }: ShareInput): string {
  const header =
    mode === "daily"
      ? `🐾 Animal do Dia #${dayNumber}`
      : "🐾 Bichu — Modo Infinito";
  const grid = rows.map(rowToEmojis).join("\n");
  const tries = rows.length;
  const word = tries === 1 ? "tentativa" : "tentativas";
  return `${header}\n\n${grid}\n\n${tries} ${word}\n\n${domain}`;
}
