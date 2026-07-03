// Gera uma imagem de compartilhamento (PNG) a partir das partes do resultado.
// Dependência-free: monta um SVG, rasteriza via <img> + canvas e devolve um Blob
// pronto para a Web Share API (navigator.share com files) — assim o Instagram
// e outros apps aparecem na folha de compartilhamento do mobile.

import type { ShareParts } from "./share";

/** Dimensões do card (4:5, formato retrato aceito pelo feed do Instagram). */
const WIDTH = 1080;
const HEIGHT = 1350;

// Paleta da marca (espelha src/app/globals.css; o SVG não herda CSS vars).
const COLORS = {
  bg: "#f6f3ee",
  brand: "#7aa6a1",
  accent: "#e4b363",
  text: "#2f3a39",
  muted: "#868885",
};

// Fonte system-ui — next/font não está disponível no contexto isolado do SVG.
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] as string,
  );
}

/** Monta o SVG do card de compartilhamento. */
export function buildShareSvg(parts: ShareParts): string {
  const cx = WIDTH / 2;

  const brand = { fs: 86, h: 104 }; // h inclui espaço do traço de destaque
  const header = { fs: 42, h: 60 };
  const rowH = 85;
  const result = { fs: 52, h: 52 };
  const link = { fs: 38, h: 38 };
  const gap = 3;

  const rows = parts.grid.length;
  const heights = [brand.h, header.h, ...Array.from<number>({ length: rows }).fill(rowH), result.h, link.h];
  const totalH = heights.reduce((sum, h) => sum + h, 0) + gap * (heights.length - 1);

  let cursor = (HEIGHT - totalH) / 2;
  const next = (h: number): number => {
    const top = cursor;
    cursor += h + gap;
    return top;
  };

  const lines: string[] = [];
  lines.push(`<rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.bg}"/>`);

  // Marca + traço de destaque.
  const brandTop = next(brand.h);
  lines.push(
    `<text x="${cx}" y="${brandTop + brand.fs * 0.85}" font-family="${FONT}" font-size="${brand.fs}" font-weight="800" fill="${COLORS.brand}" text-anchor="middle">${escapeXml("🐾 Bichu")}</text>`,
  );
  lines.push(
    `<rect x="${cx - 72}" y="${brandTop + brand.h - 14}" width="144" height="8" rx="4" fill="${COLORS.accent}"/>`,
  );

  // Cabeçalho (modo/dia).
  const headerTop = next(header.h);
  lines.push(
    `<text x="${cx}" y="${headerTop + header.fs * 0.8}" font-family="${FONT}" font-size="${header.fs}" font-weight="600" fill="${COLORS.muted}" text-anchor="middle">${escapeXml(parts.header)}</text>`,
  );

  // Grid de emojis (uma linha por tentativa).
  for (const line of parts.grid) {
    const top = next(rowH);
    lines.push(
      `<text x="${cx}" y="${top + 66 * 0.85}" font-family="${FONT}" font-size="66" letter-spacing="10" fill="${COLORS.text}" text-anchor="middle">${line}</text>`,
    );
  }

  // Resultado + link.
  const resultTop = next(result.h);
  lines.push(
    `<text x="${cx}" y="${resultTop + result.fs * 0.85}" font-family="${FONT}" font-size="${result.fs}" font-weight="700" fill="${COLORS.text}" text-anchor="middle">${escapeXml(parts.resultLine)}</text>`,
  );
  const linkTop = next(link.h);
  lines.push(
    `<text x="${cx}" y="${linkTop + link.fs * 0.8}" font-family="${FONT}" font-size="${link.fs}" fill="${COLORS.muted}" text-anchor="middle">${escapeXml(parts.link)}</text>`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">${lines.join("")}</svg>`;
}

/** Rasteriza o SVG e devolve um Blob PNG pronto para compartilhamento/download. */
export async function renderSharePng(parts: ShareParts): Promise<Blob> {
  if (typeof document === "undefined") {
    throw new Error("renderSharePng só funciona no navegador");
  }

  const svg = buildShareSvg(parts);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  const img = new Image();
  img.src = url;
  if (typeof img.decode === "function") {
    await img.decode();
  } else {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Falha ao carregar a imagem"));
    });
  }

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar o PNG"))),
      "image/png",
    );
  });
}
