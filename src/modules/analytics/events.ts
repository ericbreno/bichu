import type { AnalyticsEvent } from "./analytics.interface";

// Lista canônica de eventos rastreados. Mantenha sincronizado com AnalyticsEvent.
export const ANALYTICS_EVENTS: readonly AnalyticsEvent[] = [
  "page_view",
  "cta_click",
  "game_won",
  "game_lost",
  "share_clicked",
  "share_image_clicked",
] as const;
