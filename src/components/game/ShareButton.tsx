"use client";

// Botão Compartilhar: usa a Web Share API quando disponível (mobile); caso
// contrário copia para a área de transferência e mostra um toast.
import { useAnalytics } from "@/modules/analytics/analytics-context";
import { useToast } from "@/components/ui/Toast";
import styles from "./ShareButton.module.css";

interface Props {
  getText: () => string;
  label?: string;
}

export function ShareButton({ getText, label = "Compartilhar" }: Props) {
  const toast = useToast();
  const analytics = useAnalytics();

  async function handleShare() {
    const text = getText();
    analytics.track("share_clicked", {});
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ text });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        toast.show("Resultado copiado!");
      }
    } catch {
      // Compartilhamento cancelado ou área de transferência bloqueada — silencioso.
    }
  }

  return (
    <button type="button" className={`btn btn-primary ${styles.share}`} onClick={handleShare}>
      <span aria-hidden="true">📤</span> {label}
    </button>
  );
}
