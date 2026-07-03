import { Cell } from "@/lib/game/types";
import styles from "./HistoryGrid.module.css";

function cellText(cell: Cell): string {
  if (cell.hint) return cell.hint;
  if (cell.tone === "green") return "Sim";
  if (cell.tone === "red") return "Não";
  return "—";
}

export default function Guess({cell}: {cell: Cell}) {
  return <div key={cell.key} className={styles.chip} data-tone={cell.tone}>
    <span className={styles.chipLabel}>{cell.label}</span>
    <span className={styles.chipValue}>{cellText(cell)}</span>
  </div>;
}
