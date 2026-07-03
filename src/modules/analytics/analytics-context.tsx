"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { site } from "@/config/site";
import { GoogleAnalyticsProvider } from "./ga.provider";
import { noopAnalytics } from "./noop.provider";
import type { AnalyticsProvider } from "./analytics.interface";

// Usa GA quando há um id de medição configurado; caso contrário, no-op.
const defaultProvider =
  site.gaId.length > 0 ? new GoogleAnalyticsProvider() : noopAnalytics;

const AnalyticsContext = createContext<AnalyticsProvider>(defaultProvider);

export function AnalyticsContextProvider({
  value,
  children,
}: {
  value?: AnalyticsProvider;
  children: ReactNode;
}) {
  const provider = useMemo(() => value ?? defaultProvider, [value]);
  return <AnalyticsContext.Provider value={provider}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics(): AnalyticsProvider {
  return useContext(AnalyticsContext);
}
