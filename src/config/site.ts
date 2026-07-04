// Configuração central do site. Fonte única para as strings de marca.
// Edite estes valores ao iniciar um novo projeto a partir do bootstrap.

export const site = {
  name: "Bichu",
  domain: "bi-chuu.web.app",
  url: "https://bi-chuu.web.app",
  supportEmail: "contato@bi-chuu.web.app",
  author: {
    name: "Eric Breno",
    linkedin: "https://www.linkedin.com/in/ericbreno/",
    linkedinHandle: "in/ericbreno",
  },
  gaId: "G-7VE2SHE9CF",
  // Publisher ID do AdSense (ca-pub-...). Vazio = anúncios desligados.
  adsenseClient: "ca-pub-4060030917657414",
} as const;
