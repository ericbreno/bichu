# Bichu

Jogo online de adivinhação de animais: descubra o animal secreto a cada chute, com
pistas sobre classe, dieta, habitat, peso e mais. Modos Animal do Dia e Infinito.

Construído com Next.js 15 (App Router) + TypeScript + exportação estática
(`output: 'export'`), com shell da aplicação, design tokens, SEO/metadata, analytics
(Google Analytics) e persistência (localStorage) — tudo atrás de abstrações trocáveis.

## Stack

Next.js 15 (App Router) · TypeScript strict · `output: 'export'` (hospedagem
estática) · CSS Modules + CSS variables · next/font (Inter) · zero backend/banco de
dados · persistência e analytics via interfaces/provider.

## Scripts

```bash
npm install        # instalar dependências
npm run dev        # ambiente de desenvolvimento
npm run build      # build estático → diretório out/
npm run typecheck  # checagem de tipos
```

O conteúdo de `out/` pode ser servido por qualquer host estático (Firebase Hosting,
Vercel, Netlify, Cloudflare Pages, GitHub Pages…).

## Configuração

- `src/config/site.ts` — marca, domínio, URL, e-mail de suporte e id do Google
  Analytics (`NEXT_PUBLIC_GA_ID`). Sem o id, o analytics vira no-op.
- `src/app/globals.css` — tokens de design (paleta + derivados) no `:root`.
- `src/app/layout.tsx` — metadata de SEO, JSON-LD e injeção do GA.
- `.env.local` — variáveis de ambiente (veja `.env.example`).

## Arquitetura

Módulos com `interface`/`provider` trocáveis — `storage` e `analytics`. A UI consome
esses providers via hooks (`useStorage`, `useAnalytics`); a implementação concreta
(localStorage, GA) vive nos módulos, então pode ser trocada sem tocar na UI.

```
src/
  app/              # layout raiz, home e páginas
  components/       # Shell (cabeçalho/rodapé), Logo, AdSlot
  config/site.ts    # fonte única da marca
  modules/
    storage/        # StorageProvider + localStorage + contexto React
    analytics/      # AnalyticsProvider + GA + no-op + contexto React
  lib/              # utilidades (datas, normalização, rng determinístico)
  types/            # re-exports de tipos compartilhados
```

## Como usar este starter

1. Copie esta pasta para um novo diretório e renomeie o projeto em
   `package.json` e em `src/config/site.ts`.
2. Siga o **`INSTRUCTIONS.md`** para configurar marca, SEO, analytics, PWA, deploy e
   domínio. Esse documento é escrito como um roteiro acionável — você pode pedir ao
   Claude (ex.: "configure o SEO para meudominio.com.br") e ele segue o documento.
