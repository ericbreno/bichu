# INSTRUCTIONS.md — Roteiro por projeto

Este documento orienta a configuração de **cada novo projeto** criado a partir do
`next-bootstrap`. Ele é escrito como um roteiro **acionável**: ao iniciar um projeto,
você pode pedir ao Claude algo como *"configure o SEO para meudominio.com.br"* e ele
segue as seções abaixo (caminhos de arquivo e comandos exatos).

> Convenção: sempre que um comando ou arquivo mencionar `meudominio.com.br` ou
> `Meu App`, substitua pelos valores reais do projeto.

---

## Índice

1. [Início rápido](#1-início-rápido)
2. [Marca & configuração](#2-marca--configuração)
3. [Assets & identidade visual](#3-assets--identidade-visual)
4. [SEO](#4-seo)
5. [Analytics (Google Analytics 4)](#5-analytics-google-analytics-4)
6. [PWA / instalável](#6-pwa--instalável)
7. [Persistência](#7-persistência)
8. [Deploy](#8-deploy)
9. [Domínio & DNS](#9-domínio--dns)
10. [Acessibilidade & performance](#10-acessibilidade--performance)
11. [Checklist de lançamento](#11-checklist-de-lançamento)

---

## 1. Início rápido

```bash
# 1. Copie o starter para um novo diretório e entre nele
cp -R /Users/ericpersonal/workspace/next-bootstrap /Users/ericpersonal/workspace/<novo-projeto>
cd /Users/ericpersonal/workspace/<novo-projeto>

# 2. Inicie um repositório limpo (o bootstrap não vem com .git)
git init

# 3. Instale dependências
npm install

# 4. Rode em desenvolvimento
npm run dev   # http://localhost:3000
```

Antes de commitar, renomeie o projeto em **`package.json`** (`"name": "<novo-projeto>"`)
e siga a [Seção 2](#2-marca--configuração).

---

## 2. Marca & configuração

Fonte única da marca: **`src/config/site.ts`**. Edite todos os campos:

```ts
export const site = {
  name: "Meu App",                 // → nome de exibição
  domain: "example.com",           // → domínio de produção (sem https)
  url: "https://example.com",      // → URL canônica completa
  supportEmail: "contato@example.com",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
} as const;
```

Cores e tokens visuais: **`src/app/globals.css`**, bloco `:root`. Tokens a ajustar:

- `--bg`, `--surface` — fundos
- `--primary`, `--secondary`, `--accent` — cores da marca
- `--text`, `--muted` — texto
- `--max-width` — largura máxima da coluna (padrão `480px`; use `1024px`+ para apps largos)

> **Importante:** ao mudar `--primary`, atualize também o `themeColor` em
> `src/app/layout.tsx` (`export const viewport`) e em `public/manifest.webmanifest`
> para a cor ficar consistente na barra do navegador/PWA.

---

## 3. Assets & identidade visual

Arquivos a substituir em **`public/`** (os que vêm no bootstrap são placeholders):

| Arquivo | Tamanho | Uso |
|---|---|---|
| `favicon.svg` / `favicon.ico` | — | aba do navegador |
| `icon-192.png` | 192×192 | ícone PWA / Android |
| `icon-512.png` | 512×512 | ícone PWA / splash |
| `apple-touch-icon.png` | 180×180 | iOS home screen |
| `og-image.png` | **1200×630** | preview em redes sociais (OpenGraph/Twitter) |

**Como gerar tudo de uma vez:**

1. **Favicons/ícones:** suba um PNG quadrado (≥512px) em
   <https://realfavicongenerator.net/> e use os arquivos gerados.
2. **og-image:** crie uma imagem **1200×630 px** com o nome/ marca + tagline.
   (O Claude pode gerar um `og-image.png` em HTML/canvas se você pedir.)
3. Atualize `public/manifest.webmanifest` (`name`, `short_name`, `description`,
   `background_color`, `theme_color`) — veja [Seção 6](#6-pwa--instalável).

---

## 4. SEO

A maior parte do SEO já está no **`src/app/layout.tsx`** (`export const metadata`).
Ajuste por projeto:

### 4.1 Metadata global (`src/app/layout.tsx`)

- **`title.default`** — título da home. Padrão: `"{name} — troque este título"`.
- **`title.template`** — `"%s — {name}"`: cada página declara só seu título e o nome
  da marca é anexado automaticamente.
- **`description`** — resumo de ~150 caracteres. **Otimização de maior impacto.**
- **`keywords`** — troque o array placeholder por 5–10 termos relevantes.
- **`category`** — ajuste (`games`, `business`, `news`...).
- **`openGraph` / `twitter`** — já apontam para `site.url` e `/og-image.png`;
  ajuste os títulos/descrição se diferirem do default.
- **`alternates.canonical`** — padrão `"/"` (home). Para páginas, declare
  `alternates: { canonical: "/rota/" }` na `metadata` da própria página (ver
  `src/app/sobre/page.tsx`).

### 4.2 Dados estruturados (JSON-LD)

O `layout.tsx` injeta um bloco `@type: WebSite`. Para tipos mais específicos
(`Product`, `FAQPage`, `Article`, `Organization`…), edite o objeto `jsonLd` no
`layout.tsx` ou adicione um bloco `<script type="application/ld+json">` na página.
Valide em <https://search.google.com/test/rich-results>.

### 4.3 robots.txt e sitemap.xml

Já existem em **`public/`**. Troque `https://example.com` pela URL de produção em
**ambos** os arquivos:

- `public/robots.txt` — linha `Sitemap: https://...`
- `public/sitemap.xml` — uma tag `<url>` por rota pública.

> Para sites com muitas páginas, considere gerar o sitemap dinamicamente
> (`app/sitemap.ts`). No export estático puro, manter o `sitemap.xml` manual é o
> mais simples.

### 4.4 Google Search Console

1. Acesse <https://search.google.com/search-console> e adicione a propriedade
   (Domain ou URL prefix).
2. Verifique a propriedade (DNS TXT é o mais robusto; ou meta tag / arquivo HTML).
   - Se usar arquivo HTML: coloque em `public/google-XXXXXX.html`.
3. Envie o sitemap: `https://meudominio.com.br/sitemap.xml`.

---

## 5. Analytics (Google Analytics 4)

O projeto já vem com um `AnalyticsProvider` que emite para o GA quando configurado,
e vira **no-op** quando não há id (dev local sem tracking).

### 5.1 Obter o measurement id

1. <https://analytics.google.com> → **Admin → Criar propriedade** (GA4).
2. Crie um **fluxo de dados Web** com a URL de produção.
3. Copie o **Measurement ID** (formato `G-XXXXXXX`).

### 5.2 Ativar no projeto

Crie **`.env.local`** na raiz:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXX
```

O script do gtag é injetado em `src/app/layout.tsx` apenas quando `site.gaId` não é
vazio. Reinicie o `npm run dev` após criar o `.env.local`.

### 5.3 Eventos customizados

O vocabulário de eventos vive em **`src/modules/analytics/analytics.interface.ts`**
(tipo `AnalyticsEvent`) espelhado em **`src/modules/analytics/events.ts`**. Para
adicionar um evento:

1. Acrescente o nome no union `AnalyticsEvent` **e** no array `ANALYTICS_EVENTS`.
2. Dispare de qualquer client component:

```tsx
"use client";
import { useAnalytics } from "@/modules/analytics/analytics-context";

export function CtaButton() {
  const analytics = useAnalytics();
  return (
    <button onClick={() => analytics.track("cta_click", { local: "hero" })}>
      Começar
    </button>
  );
}
```

> O provider automaticamente não faz nada se o GA estiver desativado, então você
> pode espalhar chamadas `track(...)` sem precisar checar configuração.

---

## 6. PWA / instalável

A aplicação já é "instalável" (manifest + ícones + `display: standalone`). Para
validar:

1. Ajuste **`public/manifest.webmanifest`**: `name`, `short_name`, `description`,
   `background_color` (mesma do `--bg`) e `theme_color` (mesma do `--primary`).
2. Confirme que os ícones 192/512 existem em `public/`.
3. Chrome DevTools → **Application → Manifest** deve mostrar "No issues detected".

> Para service worker / offline real, adicione `next-pwa` ou um SW manual. Para a
> maioria dos sites estáticos, o manifest já basta para "Adicionar à tela inicial".

---

## 7. Persistência

Persistência via `StorageProvider` (interface em
`src/modules/storage/storage.interface.ts`), implementada por
`LocalStorageProvider`. Acesse pelo hook:

```tsx
"use client";
import { useStorage } from "@/modules/storage/storage-context";
import { STORAGE_KEYS } from "@/lib/keys";

const storage = useStorage();
const settings = storage.get<{ tema: string }>(STORAGE_KEYS.settings);
storage.set(STORAGE_KEYS.settings, { tema: "escuro" });
```

- **Chaves centralizadas** em `src/lib/keys.ts` (`STORAGE_KEYS`). Troque o prefixo
  `"app:"` pelo slug do projeto e adicione chaves conforme precisar.
- **Trocar o backend** (ex.: uma API de sync): implemente `StorageProvider` e passe
  via `<StorageContextProvider value={meuProvider}>` no `layout.tsx`. A UI não muda.

> Nota: a versão de origem (`mapilha`) usava `sessionStorage`; este bootstrap usa
> `localStorage` (persiste entre sessões), que é o comportamento esperado para
> preferências/estado do usuário.

---

## 8. Deploy

O projeto faz **export estático** (`output: 'export'` → diretório `out/`). Qualquer
host estático serve. Primeiro rode sempre:

```bash
npm run build     # gera out/
```

### 8.1 Firebase Hosting (padrão)

Vem pré-configurado. Falta só o id do projeto:

1. Crie um projeto em <https://console.firebase.google.com> (ou use um existente).
2. Edite **`.firebaserc`**: `"default": "<seu-project-id>"`.
3. Instale a CLI uma vez: `npm install -g firebase-tools`.
4. Autentique: `firebase login`.
5. Publique:

```bash
npm run build
firebase deploy --only hosting
```

O `firebase.json` já aponta `public: "out"` e faz rewrite de tudo para
`/index.html` (compatível com rotas do App Router no host estático).

### 8.2 Alternativas (export estático)

- **Vercel:** importe o repositório; framework Next.js detectado. (Vercel também
  roda `next build` nativamente — o `output: 'export'` ainda funciona.)
- **Netlify:** build command `npm run build`, publish directory `out`.
- **Cloudflare Pages:** framework preset *Next.js (Static HTML Export)*, output `out`.
- **GitHub Pages:** publique o conteúdo de `out/` (branch `gh-pages` ou Actions).

> Em todos, defina a variável de ambiente `NEXT_PUBLIC_GA_ID` (seção 5) nas
> configurações de build do host.

---

## 9. Domínio & DNS

1. **Decidir apex vs www:** escolha a URL canônica (ex.: `https://meudominio.com.br`).
   Atualize `src/config/site.ts` (`domain` e `url`) e os arquivos da [Seção 4.3](#43-robotstxt-e-sitemapxml).
2. **DNS:** no registrador/host, aponte:
   - Apex (`@`) → A record do host (Firebase/Vercel/Netlify) **ou** CNAME/redirecione.
   - `www` → redirecione para o apex (ou vice-versa).
   - Firebase: siga "Add custom domain" no console; ele fornece os records A/AAAA/CNAME.
3. **HTTPS:** habilitado automaticamente pela maioria dos hosts (Firebase/Vercel/
   Netlify/Cloudflare). Confirme o certificado emitido após propagar o DNS.
4. **Revalidar:** após o domínio no ar, atualize a propriedade no **Google Search
   Console** e o fluxo de dados no **GA4** para a URL de produção.

---

## 10. Acessibilidade & performance

Já incluído por padrão (validar/manter):

- `@media (prefers-reduced-motion: reduce)` zera animações (`globals.css`).
- `:focus-visible` com outline visível (`globals.css`).
- `lang="pt-BR"` no `<html>` (`layout.tsx`) — ajuste se o idioma mudar.
- Imagens com `unoptimized: true` (necessário em host estático).

Checklist por página:

- [ ] Todo `<img>` tem `alt` descritivo (ou `alt=""` se decorativo).
- [ ] Contraste de texto ≥ 4.5:1 (WCAG AA).
- [ ] Navegação completa pelo teclado (Tab/Enter/Esc).
- [ ] `alt` na `og-image` e títulos hierárquicos (`h1` → `h2`).

Rode o **Lighthouse** (Chrome DevTools) na build de produção e mirar ≥90 em todas as
categorias. Fontes via `next/font` já são self-hosted (sem render-blocking).

---

## 11. Checklist de lançamento

- [ ] `package.json` `name` + `src/config/site.ts` preenchidos.
- [ ] Paleta (`globals.css`) + `themeColor` (`layout.tsx`) + `manifest` consistentes.
- [ ] Favicons, `icon-192/512.png`, `apple-touch-icon.png`, `og-image.png` reais.
- [ ] `title`/`description`/`keywords` no `layout.tsx`; canonical por página.
- [ ] `robots.txt` + `sitemap.xml` com a URL de produção.
- [ ] `NEXT_PUBLIC_GA_ID` configurado (`.env.local` e no host).
- [ ] Search Console + GA4 apontando para a URL de produção.
- [ ] `npm run build` limpo → `out/` gerado.
- [ ] Deployado; HTTPS ativo; domínio canônico redirecionando corretamente.
- [ ] Lighthouse ≥90; smoke-test em mobile + desktop.

---

## Atalhos para o Claude

Frases prontas para acionar o Claude seguindo este documento:

- *"Inicie um novo projeto chamado **X** no domínio **Y**"* → seções 1–2.
- *"Configure o SEO para **meudominio.com.br**"* → seção 4.
- *"Ative o Google Analytics com o id **G-XXXX***"* → seção 5.
- *"Gere um og-image 1200×630 com a marca **X**"* → seção 3.
- *"Configure o deploy no Firebase / Vercel / Netlify"* → seção 8.
- *"Faça o checklist de lançamento"* → seção 11.
