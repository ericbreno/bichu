"use client";

import { useEffect } from "react";
import { site } from "@/config/site";
import styles from "./AdSlot.module.css";
import { useStorage } from "@/modules/storage/storage-context";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// Espaço reservado para anúncio. Quando `site.adsenseClient` e `adsenseSlot`
// estão configurados, renderiza um bloco real do AdSense; caso contrário, nada
// é renderizado (placeholder desligado). O `push` em `useEffect` inicializa o
// bloco depois do mount — por isso este componente é um Client Component.
export function AdSlot({
  slot,
  adsenseSlot,
  format = "auto",
  responsive = true,
}: {
  slot: string;
  adsenseSlot?: string;
  format?: string;
  responsive?: boolean;
}) {
  const storage = useStorage();
  const ads = storage.get('ads');

  useEffect(() => {
    if (!site.adsenseClient || !adsenseSlot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle ainda não carregou; o AdSense tenta de novo quando pronto.
    }
  }, [adsenseSlot]);

  if (!site.adsenseClient || !adsenseSlot || !ads) return null;

  return (
    <div className={styles.slot} data-slot={slot}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={site.adsenseClient}
        data-ad-slot={adsenseSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
