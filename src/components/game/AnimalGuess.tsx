import styles from "./HistoryGrid.module.css";
import Guess from "./Guess";
import { GuessRow } from "@/lib/game/types";

export function AnimalGuess({
  row,
  attemptIndex,
  noBoolean = false
}: {
  row: GuessRow;
  attemptIndex: number;
  noBoolean?: boolean;
}) {
  console.log({row})
  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${Math.min(attemptIndex, 6) * 40}ms` }}
    >
      <header className={styles.header}>
        <span className={styles.emoji} aria-hidden="true">
          {row.emoji ?? "🐾"}
        </span>
        <span className={styles.name}>{row.nome}</span>
      </header>
      <div className={styles.chips}>
        {row.cells.filter(cell => noBoolean ? !!cell.hint : true).map((cell, idx) => (
          <Guess cell={cell} key={idx} />
        ))}
      </div>
    </article>
  );
}