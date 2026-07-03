// Normalização insensível a acentos e caixa. Útil para buscas e comparação de textos
// (ex.: "sao" casa com "São...", "campina grande" é aceito).
export function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove diacríticos combinantes
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}
