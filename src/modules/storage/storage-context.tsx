"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { localStorageProvider } from "./local.provider";
import type { StorageProvider } from "./storage.interface";

const StorageContext = createContext<StorageProvider>(localStorageProvider);

export function StorageContextProvider({
  value,
  children,
}: {
  value?: StorageProvider;
  children: ReactNode;
}) {
  const provider = useMemo(() => value ?? localStorageProvider, [value]);
  return <StorageContext.Provider value={provider}>{children}</StorageContext.Provider>;
}

export function useStorage(): StorageProvider {
  return useContext(StorageContext);
}
