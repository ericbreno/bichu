"use client";

// Histórico de tentativas. Cada chute vira um cartão com um chip colorido por
// característica (estilo Pedantle, ideal para mobile). O tom de cada chip é a
// principal pista de dedução.
import type { GuessRow } from "@/lib/game/types";
import { AnimalGuess } from "./AnimalGuess";
import styles from "./HistoryGrid.module.css";

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
        <AnimalGuess row={row} attemptIndex={attemptIndex} key={row.animalId} noBoolean />
      ))}
    </div>
  );
}
