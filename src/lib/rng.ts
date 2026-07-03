// Pseudoaleatório determinístico e sem dependências.
// Útil quando múltiplos clientes precisam chegar ao mesmo resultado a partir de uma
// string-semente (ex.: "item do dia" consistente para todos, permutações estáveis).

/** xfnv1a → semente de 32 bits sem sinal a partir de uma string. */
export function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/** mulberry32: PRNG rápido que retorna floats em [0, 1). Determinístico por semente. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Permutação Fisher–Yates com semente dos índices [0, length). */
export function createPermutation(length: number, seed: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  const rng = mulberry32(seed);
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}
