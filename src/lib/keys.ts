// Chaves centralizadas de armazenamento para que nunca divergirem entre
// leitores/escritores. Prefixo "bichu:" é o slug do projeto.
export const STORAGE_KEYS = {
  /** Preferências do usuário (ex.: animações, redução de movimento). */
  settings: "bichu:settings",
  /** Estado da partida diária: { date, attempts, status }. */
  daily: "bichu:daily",
  /** Estado da partida infinita em andamento: { answerId, attempts, status }. */
  infinite: "bichu:infinite",
  /** Estatísticas acumuladas: partidas, vitórias, derrotas, sequências. */
  stats: "bichu:stats",
} as const;
