"use client";

// Orquestra uma partida de um modo (Diário ou Infinito). Compõe busca,
// histórico, legenda e os modais de resultado/estatísticas.
import { useEffect, useState } from "react";
import { AnimalSearch } from "./AnimalSearch";
import { HistoryGrid } from "./HistoryGrid";
import { Legend } from "./Legend";
import { ResultModal } from "./ResultModal";
import { StatsModal } from "./StatsModal";
import { useGameSession } from "./useGameSession";
import type { GameMode } from "@/lib/game/types";
import styles from "./GameBoard.module.css";

export function GameBoard({ mode }: { mode: GameMode }) {
  const game = useGameSession(mode);
  const [resultOpen, setResultOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  // Reabre o modal de resultado sempre que a partida termina.
  useEffect(() => {
    if (game.status !== "playing") setResultOpen(true);
  }, [game.status]);

  if (!game.hydrated) {
    return <div className={styles.loading}>Carregando…</div>;
  }

  const finished = game.status !== "playing";

  return (
    <div className={styles.board}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {mode === "daily" ? "Animal do Dia" : "Modo Infinito"}
          </h1>
          <p className={styles.subtitle}>
            {mode === "daily"
              ? game.dayNumber
                ? `Edição #${game.dayNumber}`
                : "Descubra o animal de hoje"
              : "Animal sorteado a cada partida"}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setStatsOpen(true)}
          aria-label="Estatísticas"
        >
          📊
        </button>
      </header>

      <AnimalSearch
        excludeIds={game.attempts}
        onPick={game.makeGuess}
        disabled={finished}
      />

      {!finished && game.attempts.length > 0 && (
        <button
          type="button"
          className={`btn btn-ghost ${styles.giveUp}`}
          onClick={game.giveUp}
        >
          Desistir e ver resposta
        </button>
      )}

      <HistoryGrid rows={game.rows} />

      {finished && (
        <button
          type="button"
          className={`btn btn-secondary btn-block ${styles.resultBtn}`}
          onClick={() => setResultOpen(true)}
        >
          {game.status === "won" ? "🎉 Ver resultado" : "Ver a resposta"}
        </button>
      )}

      <Legend />

      {game.answer && (
        <ResultModal
          open={resultOpen}
          onClose={() => setResultOpen(false)}
          mode={mode}
          won={game.status === "won"}
          answer={game.answer}
          tries={game.attempts.length}
          dayNumber={game.dayNumber}
          rows={game.rows}
          stats={game.stats}
          onNewGame={
            mode === "infinite"
              ? () => {
                  game.newGame();
                  setResultOpen(false);
                }
              : undefined
          }
        />
      )}

      <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)} stats={game.stats} />
    </div>
  );
}
