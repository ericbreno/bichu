// Engine de comparação entre o animal chutado e o alvo. Funções puras, fáceis de
// testar e reutilizar no histórico, na legenda e no compartilhamento.

import { normalizeText } from "@/lib/normalize";
import type { Animal, Cell, Tone } from "./types";

/** Estratégia de comparação + rótulos por coluna. A ORDEM desta lista define a
 *  ordem canônica das colunas no histórico e no compartilhamento. */
export interface ColumnMeta {
  key: keyof Animal;
  label: string;
  kind: "categorical" | "multi" | "numeric" | "boolean";
  /** Para numéricos: texto quando o alvo É maior (↑) / menor (↓) que o chute. */
  greater?: string;
  lesser?: string;
}

export const COLUMNS: ColumnMeta[] = [
  { key: "classe", label: "Classe", kind: "categorical" },
  { key: "dieta", label: "Dieta", kind: "multi" },
  { key: "continentes", label: "Continentes", kind: "multi" },
  { key: "habitat", label: "Habitat", kind: "multi" },
  { key: "pesoMedioKg", label: "Peso", kind: "numeric", greater: "Mais pesado", lesser: "Mais leve" },
  { key: "comprimentoCm", label: "Comprimento", kind: "numeric", greater: "Maior", lesser: "Menor" },
  { key: "velocidadeMaxima", label: "Velocidade", kind: "numeric", greater: "Mais rápido", lesser: "Mais lento" },
  { key: "expectativaVida", label: "Vida média", kind: "numeric", greater: "Vive mais", lesser: "Vive menos" },
  { key: "domestico", label: "Doméstico", kind: "boolean" },
  { key: "voa", label: "Voa", kind: "boolean" },
  { key: "nada", label: "Nada", kind: "boolean" },
  { key: "venenoso", label: "Venenoso", kind: "boolean" },
  { key: "oviparo", label: "Ovíparo", kind: "boolean" },
  { key: "noturno", label: "Noturno", kind: "boolean" },
  { key: "ameacado", label: "Ameaçado", kind: "boolean" },
];

/** Subconjunto de colunas exibido no grid de emojis do compartilhamento. */
export const SHARE_COLUMN_KEYS: (keyof Animal)[] = [
  "classe",
  "dieta",
  "continentes",
  "habitat",
  "pesoMedioKg",
  "comprimentoCm",
  "velocidadeMaxima",
  "expectativaVida",
];

const NUMERIC_TOLERANCE = 0.12; // |razão - 1| <= tol  → "≈" (verde)
const NUMERIC_NEAR = [0.5, 2]; // dentro desse fator → amarelo ("perto")

function compareCategorical(guess: string, answer: string, meta: ColumnMeta): Cell {
  const equal = normalizeText(guess) === normalizeText(answer);
  return { key: meta.key, label: meta.label, tone: equal ? "green" : "red" };
}

function compareMulti(guess: string[], answer: string[], meta: ColumnMeta): Cell {
  const g = guess.map(normalizeText);
  const overlap = answer.filter((v) => g.includes(normalizeText(v))).length;
  let tone: Tone;
  let hint: string;
  if (answer.length === 0 || overlap === answer.length) {
    tone = "green";
    hint = "Igual";
  } else if (overlap > 0) {
    tone = "yellow";
    hint = "Parcial";
  } else {
    tone = "red";
    hint = "Diferente";
  }
  return { key: meta.key, label: meta.label, tone, hint };
}

function compareNumeric(guess: number, answer: number, meta: ColumnMeta): Cell {
  // answer/guess > 1  → o alvo é MAIOR que o chute.
  const ratio = guess === 0 ? Number.POSITIVE_INFINITY : answer / guess;
  const targetGreater = answer > guess;
  const near = ratio >= NUMERIC_NEAR[0] && ratio <= NUMERIC_NEAR[1];

  if (Math.abs(ratio - 1) <= NUMERIC_TOLERANCE) {
    return { key: meta.key, label: meta.label, tone: "green", hint: "≈ Igual" };
  }
  const arrow = targetGreater ? "↑" : "↓";
  const word = targetGreater ? meta.greater ?? "Maior" : meta.lesser ?? "Menor";
  const tone: Tone = near ? "yellow" : "red";
  return { key: meta.key, label: meta.label, tone, hint: `${arrow} ${word}` };
}

function compareBoolean(guess: boolean, answer: boolean, meta: ColumnMeta): Cell {
  return { key: meta.key, label: meta.label, tone: guess === answer ? "green" : "red" };
}

/** Compara um chute com o alvo e devolve uma célula por coluna (ordem canônica). */
export function compareAnimals(guess: Animal, answer: Animal): Cell[] {
  return COLUMNS.map((meta) => {
    const g = guess[meta.key];
    const a = answer[meta.key];
    switch (meta.kind) {
      case "categorical":
        return compareCategorical(String(g), String(a), meta);
      case "multi":
        return compareMulti(g as string[], a as string[], meta);
      case "numeric":
        return compareNumeric(Number(g), Number(a), meta);
      case "boolean":
        return compareBoolean(Boolean(g), Boolean(a), meta);
      default:
        return { key: meta.key, label: meta.label, tone: "neutral" };
    }
  });
}

/** Emoji de cada tom, usado no compartilhamento. */
export function toneToEmoji(tone: Tone): string {
  switch (tone) {
    case "green":
      return "🟩";
    case "yellow":
      return "🟨";
    case "red":
      return "🟥";
    default:
      return "⬜";
  }
}
