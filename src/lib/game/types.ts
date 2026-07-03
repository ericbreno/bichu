// Tipos centrais do jogo. Mantidos aqui para que a engine, os componentes e a
// camada de persistência compartilhem o mesmo vocabulário.

/** Classes zoológicas usadas na base. */
export type Classe =
  | "Mamífero"
  | "Ave"
  | "Réptil"
  | "Anfíbio"
  | "Peixe"
  | "Inseto"
  | "Aracnídeo"
  | "Molusco"
  | "Crustáceo";

/** Um animal da base (ver src/data/animals.json). */
export interface Animal {
  id: string;
  nome: string;
  emoji?: string;
  aliases?: string[];
  classe: Classe;
  dieta: string[];
  habitat: string[];
  continentes: string[];
  pesoMedioKg: number;
  comprimentoCm: number;
  expectativaVida: number;
  velocidadeMaxima: number;
  domestico: boolean;
  voa: boolean;
  nada: boolean;
  venenoso: boolean;
  oviparo: boolean;
  noturno: boolean;
  ameacado: boolean;
}

/** Tom (cor) de uma célula de comparação, alinhado à paleta pastel do jogo. */
export type Tone = "green" | "yellow" | "red" | "neutral";

/** Classifica o tipo de comparação aplicável a um campo. */
export type FieldKind = "categorical" | "multi" | "numeric" | "boolean";

/** Descrição de uma coluna/atributo comparável. A ordem de COLUMN_DEFS define a
 *  ordem canônica usada no histórico e no compartilhamento. */
export interface FieldDef {
  key: keyof Animal;
  kind: FieldKind;
  /** Rótulo curto exibido no histórico/legenda. */
  label: string;
}

/** Resultado da comparação de um campo entre o chute e o alvo. */
export interface Cell {
  key: keyof Animal;
  label: string;
  tone: Tone;
  /** Texto curto de feedback (ex.: "Parcial", "↑ Mais pesado"). */
  hint?: string;
}

/** Linha de tentativa: o animal chutado + as células comparadas. */
export interface GuessRow {
  animalId: string;
  nome: string;
  emoji?: string;
  cells: Cell[];
}

/** Estado de uma partida. */
export type GameStatus = "playing" | "won" | "lost";

export type GameMode = "daily" | "infinite";
