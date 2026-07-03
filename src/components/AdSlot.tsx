import styles from "./AdSlot.module.css";

// Espaço reservado para anúncio. Não renderiza nada ativo — apenas um placeholder
// estilizado. Ative com `active` (ou conecte um provider de ads) quando quiser.
export function AdSlot({ slot, active = false }: { slot: string; active?: boolean }) {
  if (!active) return null;
  return (
    <div className={styles.slot} data-slot={slot}>
      <span className={styles.label}>espaço publicitário</span>
    </div>
  );
}
