// Utilidades de data local. Toda a matemática é feita na meia-noite local para que
// resultados baseados em "o dia de hoje" sejam consistentes independentemente de DST.

const MS_PER_DAY = 86_400_000;

export function toLocalMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Diferença em dias inteiros entre duas datas locais (b - a). */
export function diffDays(a: Date, b: Date): number {
  const ms = toLocalMidnight(b).getTime() - toLocalMidnight(a).getTime();
  return Math.round(ms / MS_PER_DAY);
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return toYYYYMMDD(a) === toYYYYMMDD(b);
}

// --- Horário de Brasília (BRT, America/Sao_Paulo, UTC-3 sem horário de verão) ---
// O "Animal do Dia" precisa ser o mesmo para todos no mesmo dia, independente do
// fuso do aparelho. Por isso calculamos o dia no fuso BRT via Intl.DateTimeFormat.

const BRT_TZ = "America/Sao_Paulo";
// Marco zero do Diário. O nº do dia (#1) começa aqui.
const DAILY_EPOCH_UTC = Date.UTC(2026, 5, 3);

/** String YYYY-MM-DD da meia-noite de Brasília para o instante dado. */
export function brtDateString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BRT_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Número sequencial do dia no fuso BRT (#1 = 2024-01-01). Idêntico em qualquer
 *  fuso do dispositivo — base do sorteio determinístico e do cabeçalho do share. */
export function brtDayNumber(date = new Date()): number {
  const brtMs = Date.parse(`${brtDateString(date)}T00:00:00-03:00`);
  return Math.floor((brtMs - DAILY_EPOCH_UTC) / MS_PER_DAY) + 1;
}

/** Diferença em dias inteiros (b - a) entre duas strings YYYY-MM-DD (interpretadas
 *  em BRT). Usada para verificar dias consecutivos no cálculo de sequência. */
export function diffBrtDays(a: string, b: string): number {
  const ta = Date.parse(`${a}T00:00:00-03:00`);
  const tb = Date.parse(`${b}T00:00:00-03:00`);
  return Math.round((tb - ta) / MS_PER_DAY);
}
