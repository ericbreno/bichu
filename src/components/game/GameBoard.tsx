"use client";

// Orquestra uma partida de um modo (Diário ou Infinito). Compõe busca,
// histórico, legenda e os modais de resultado/estatísticas.
import { useEffect, useState } from "react";
import { AnimalSearch } from "./AnimalSearch";
import { HistoryGrid } from "./HistoryGrid";
import { Legend } from "./Legend";
import { ResultModal } from "./ResultModal";
import { StatsModal } from "./StatsModal";
import { GameSession, useGameSession } from "./useGameSession";
import type { Animal, Cell, GameMode, GuessRow } from "@/lib/game/types";
import styles from "./GameBoard.module.css";
import { AnimalGuess } from "./AnimalGuess";

function formatProp(prop: keyof Animal, value: unknown) {
  if (prop === 'continentes') {
    const typed = value as string[];
    return typed.length > 2 ? [typed[0], `+${typed.length - 1}`] : value;
  }
  if (prop === 'comprimentoCm') return `${value}cm`;
  if (prop === 'expectativaVida') return `${value} anos`;
  if (prop === 'velocidadeMaxima') return `${value} km/h`;
  if (prop === 'pesoMedioKg' && typeof value === 'number') 
    return value >= 1 ? `${value}kg` : value >= 0.001 ? `${(value * 1000)}g` : '< 1g';
  return value;
}

function getAnswerMatch(won: boolean, answer: Animal | null, game: GameSession): GuessRow {
  return {
    emoji: won && answer?.emoji || "❓",
    animalId: won && answer?.id || "?",
    nome: won && answer?.nome || "Animal do Dia",
    cells: Object.values(game.rows.reduce((ac, row) => {
      row.cells.forEach(cell => {
        if (!answer?.[cell.key]) return ac;

        const ansValue = formatProp(cell.key, answer![cell.key]);
        const isBoolean = typeof ansValue === 'boolean';
        if (cell.tone === 'green' || isBoolean) {
          const hint = isBoolean ? cell.hint : `${ansValue}`;
          ac[cell.key] = { ...cell, tone: 'green', hint };
        }
        // if (!ac[cell.key]) ac[cell.key] = {
        //   ...cell,
        //   hint: '?'
        // };
      });
      return ac;
    }, {} as Record<string, Cell>))
  };
}

export function GameBoard({ mode }: { mode: GameMode }) {
  const game = useGameSession(mode);
  const [resultOpen, setResultOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const answer = game.answer;

  const won = game.status === 'won';
  const ansMatch: GuessRow = getAnswerMatch(won, answer, game);

  // Reabre o modal de resultado sempre que a partida termina.
  useEffect(() => {
    if (game.status !== "playing") setResultOpen(true);
  }, [game.status]);

  if (!game.hydrated) {
    return <div className={styles.loading}>Carregando…</div>;
  }

  const finished = game.status !== "playing";

  return (
    <div className={styles.board} onClick={() => finished && !resultOpen && setResultOpen(true)}>
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

      {game.attempts.length > 0 ? <AnimalGuess row={ansMatch} attemptIndex={0} /> : null}

      {!finished && game.attempts.length > 0 && (
        <div className={styles.tries}>
          <div>Tentativas</div>

          <button
            type="button"
            className={`btn btn-ghost ${styles.giveUp}`}
            onClick={game.giveUp}
          >
            Desistir e ver resposta
          </button>
        </div>
      )}

      <HistoryGrid rows={finished ? game.rows.slice(0, -1) : game.rows} />

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
