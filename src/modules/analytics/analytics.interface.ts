// Porta de analytics + vocabulário de eventos. Centralizar os nomes de eventos aqui
// evita que as chamadas de tracking se espalhem inconsistentemente pela app.
//
// Adicione/remova eventos conforme o projeto exigir. Mantenha `ANALYTICS_EVENTS`
// (em events.ts) sincronizado com este tipo.

export type AnalyticsEvent =
  | "page_view"
  | "cta_click"
  | "game_won"
  | "game_lost"
  | "share_clicked"
  | "share_image_clicked";

export type AnalyticsValue = string | number | boolean | undefined;

export interface AnalyticsParams {
  [key: string]: AnalyticsValue;
}

export interface AnalyticsProvider {
  track(event: AnalyticsEvent, params?: AnalyticsParams): void;
}
