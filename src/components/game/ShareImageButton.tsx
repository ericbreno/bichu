"use client";

// Botão Compartilhar imagem: gera um PNG do resultado e usa a Web Share API com
// `files` (o que faz o Instagram e outros apps aparecerem na folha de
// compartilhamento no mobile). Quando indisponível (ex.: desktop), baixa o PNG.
import { useState } from "react";
import { useAnalytics } from "@/modules/analytics/analytics-context";
import { useToast } from "@/components/ui/Toast";
import { renderSharePng } from "@/lib/game/share-image";
import type { ShareParts } from "@/lib/game/share";
import styles from "./ShareButton.module.css";

interface Props {
  parts: ShareParts;
  getText: () => string;
  label?: string;
}

export function ShareImageButton({ parts, getText, label = "Compartilhar imagem" }: Props) {
  const toast = useToast();
  const analytics = useAnalytics();
  const [busy, setBusy] = useState(false);

  async function handleShare() {
    if (busy) return;
    analytics.track("share_image_clicked", {});
    setBusy(true);
    try {
      const blob = await renderSharePng(parts);
      const file = new File([blob], "bichu.png", { type: "image/png" });

      if (
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({ files: [file], text: getText() });
        return;
      }

      // Sem Web Share com arquivos: baixa a imagem localmente.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bichu.png";
      a.click();
      URL.revokeObjectURL(url);
      toast.show("Imagem baixada!");
    } catch {
      // Compartilhamento cancelado ou falha ao gerar — silencioso.
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className={`btn btn-secondary ${styles.share}`}
      onClick={handleShare}
      disabled={busy}
    >
      <span aria-hidden="true">{busy ? "⏳" : "🖼️"}</span> {busy ? "Gerando..." : label}
    </button>
  );
}
