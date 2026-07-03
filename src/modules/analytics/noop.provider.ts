import type { AnalyticsProvider } from "./analytics.interface";

// Usado quando nenhum id de analytics está configurado (ex.: dev local). Não rastreia nada.
export const noopAnalytics: AnalyticsProvider = {
  track() {},
};
