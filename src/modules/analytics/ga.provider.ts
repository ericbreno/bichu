import type { AnalyticsEvent, AnalyticsParams, AnalyticsProvider } from "./analytics.interface";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Google Analytics via gtag. Seguro em SSR/export estático e quando o gtag está
// ausente: simplesmente não faz nada em vez de lançar. O id de medição é conectado
// uma vez via script do gtag no layout raiz; este provider apenas emite eventos.
export class GoogleAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent, params?: AnalyticsParams): void {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("event", event, params ?? {});
  }
}
