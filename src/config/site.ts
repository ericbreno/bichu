// Configuração central do site. Fonte única para as strings de marca.
// Edite estes valores ao iniciar um novo projeto a partir do bootstrap.

export const site = {
  name: "Bichu",
  domain: "bi-chuu.web.app",
  url: "https://bi-chuu.web.app/",
  supportEmail: "contato@bi-chuu.web.app",
  author: {
    name: "Eric Breno",
    linkedin: "https://www.linkedin.com/in/ericbreno/",
    linkedinHandle: "in/ericbreno",
  },
  /** Id do Google Analytics 4 (formato G-XXXXXXX).
   * Defina NEXT_PUBLIC_GA_ID (.env.local) para ativar; vazio desativa (no-op). */
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "G-7VE2SHE9CF",
} as const;
