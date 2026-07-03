"use client";

// Histórico de tentativas. Cada chute vira um cartão com um chip colorido por
// característica (estilo Pedantle, ideal para mobile). O tom de cada chip é a
// principal pista de dedução.
import type { GuessRow } from "@/lib/game/types";
import styles from "./HistoryGrid.module.css";
import Guess from "./Guess";

export function HistoryGrid({ rows }: { rows: GuessRow[] }) {
  if (rows.length === 0) {
    return (
      <p className={styles.empty}>
        Faça seu primeiro chute para começar a receber pistas.
      </p>
    );
  }

  return (
    <div className={styles.list}>
      {rows.map((row, attemptIndex) => (
        <article
          key={row.animalId}
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
            {row.cells.map((cell, idx) => (
              <Guess cell={cell} key={idx} />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}


