// Monta o texto e as partes de compartilhamento no estilo Termo: um grid de
// emojis com uma linha por tentativa, usando o subconjunto canônico de colunas.
// As "partes" são compartilhadas entre o texto copiável e a imagem gerada.

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
  /** Link exibido no rodapé (URL atual da página, sem o protocolo). */
  link: string;
}

/** Partes reutilizáveis do compartilhamento — consumidas pelo texto e pela imagem. */
export interface ShareParts {
  header: string;
  grid: string[];
  resultLine: string;
  link: string;
}

/** Remove o protocolo (http/https) e a barra final de uma URL. */
export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Monta as partes do compartilhamento a partir do estado da partida. */
export function buildShareParts({ mode, dayNumber, rows, link }: ShareInput): ShareParts {
  const header =
    mode === "daily"
      ? `Animal do Dia #${dayNumber}`
      : "Bichu — Modo Infinito";
  const filteredRows = rows.length < 6 ? rows : ([...rows.slice(0, 5), rows.at(-1)] as GuessRow[]);
  const grid = filteredRows.map(rowToEmojis);
  const tries = rows.length;
  const resultLine = `${tries} ${tries === 1 ? "tentativa" : "tentativas"}`;
  return { header, grid, resultLine, link };
}

/** Texto final copiável para a área de transferência. */
export function buildShareText(parts: ShareParts): string {
  return `${parts.header}\n\n${parts.grid.join("\n")}\n\n${parts.resultLine}\n\n${parts.link}\n`;
}
