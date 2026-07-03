// Configuração central do site. Fonte única para as strings de marca.
// Edite estes valores ao iniciar um novo projeto a partir do bootstrap.

export const site = {
  name: "Bichu",
  domain: "bichu.app",
  url: "https://bichu.app",
  supportEmail: "contato@bichu.app",
  /** Id do Google Analytics 4 (formato G-XXXXXXX).
   * Defina NEXT_PUBLIC_GA_ID (.env.local) para ativar; vazio desativa (no-op). */
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
} as const;
