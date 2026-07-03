"use client";

// Hook central de uma partida. Encapsula carregar/salvar o estado, registrar
// estatísticas e expor ações (chutar, desistir, nova partida). Mantém a UI fina.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ANIMALS, getAnimal } from "@/data";
import { useAnalytics } from "@/modules/analytics/analytics-context";
import { useStorage } from "@/modules/storage/storage-context";
import { compareAnimals } from "@/lib/game/compare";
import { getDailyInfo } from "@/lib/game/daily";
import { recordResult, type Stats } from "@/lib/game/stats";
import {
  loadDaily,
  loadInfinite,
  loadStats,
  saveDaily,
  saveInfinite,
  saveStats,
} from "@/lib/game/storage";
import type { Animal, GameMode, GameStatus, GuessRow } from "@/lib/game/types";

interface SessionState {
  answer: Animal;
  attempts: string[];
  status: GameStatus;
  /** Apenas Diário. */
  dayNumber?: number;
  dateKey?: string;
}

function randomAnimalId(excludeId?: string): string {
  const pool = excludeId ? ANIMALS.filter((a) => a.id !== excludeId) : ANIMALS;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

export interface GameSession {
  hydrated: boolean;
  mode: GameMode;
  answer: Animal | null;
  attempts: string[];
  status: GameStatus;
  rows: GuessRow[];
  dayNumber?: number;
  stats: Stats;
  makeGuess: (animalId: string) => void;
  giveUp: () => void;
  newGame: () => void;
}

export function useGameSession(mode: GameMode): GameSession {
  const storage = useStorage();
  const analytics = useAnalytics();
  const [session, setSession] = useState<SessionState | null>(null);
  const [stats, setStats] = useState<Stats>({ played: 0, wins: 0, losses: 0, distribution: {}, currentStreak: 0, maxStreak: 0, lastDailyDateKey: null });
  const [hydrated, setHydrated] = useState(false);
  const initKey = useRef<string>("");

  // --- Inicialização (uma vez por modo) -------------------------------------
  useEffect(() => {
    if (initKey.current === mode) return;
    initKey.current = mode;

    setStats(loadStats(storage));

    if (mode === "daily") {
      const info = getDailyInfo();
      const persisted = loadDaily(storage);
      if (persisted && persisted.dateKey === info.dateKey) {
        setSession({
          answer: info.answer,
          attempts: persisted.attempts,
          status: persisted.status,
          dayNumber: info.dayNumber,
          dateKey: info.dateKey,
        });
      } else {
        setSession({
          answer: info.answer,
          attempts: [],
          status: "playing",
          dayNumber: info.dayNumber,
          dateKey: info.dateKey,
        });
        saveDaily(storage, { dateKey: info.dateKey, attempts: [], status: "playing" });
      }
    } else {
      const persisted = loadInfinite(storage);
      const answer = persisted ? getAnimal(persisted.answerId) : null;
      if (persisted && answer) {
        setSession({ answer, attempts: persisted.attempts, status: persisted.status });
      } else {
        const id = randomAnimalId();
        const fresh = getAnimal(id);
        if (fresh) {
          setSession({ answer: fresh, attempts: [], status: "playing" });
          saveInfinite(storage, { answerId: id, attempts: [], status: "playing" });
        }
      }
    }

    setHydrated(true);
  }, [mode, storage]);

  // --- Virada de dia no modo Diário -----------------------------------------
  useEffect(() => {
    if (mode !== "daily") return;
    const tick = () => {
      const info = getDailyInfo();
      setSession((prev) => {
        if (!prev || prev.dateKey === info.dateKey) return prev;
        saveDaily(storage, { dateKey: info.dateKey, attempts: [], status: "playing" });
        return {
          answer: info.answer,
          attempts: [],
          status: "playing",
          dayNumber: info.dayNumber,
          dateKey: info.dateKey,
        };
      });
    };
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [mode, storage]);

  // --- Persistência por modo ------------------------------------------------
  const persist = useCallback(
    (s: SessionState) => {
      if (mode === "daily" && s.dateKey) {
        saveDaily(storage, { dateKey: s.dateKey, attempts: s.attempts, status: s.status });
      } else if (mode === "infinite") {
        saveInfinite(storage, { answerId: s.answer.id, attempts: s.attempts, status: s.status });
      }
    },
    [mode, storage],
  );

  const recordOutcome = useCallback(
    (won: boolean, tries: number, dateKey?: string) => {
      setStats((prev) => {
        const updated = recordResult(prev, { mode, won, tries, dailyDateKey: dateKey });
        saveStats(storage, updated);
        return updated;
      });
      analytics.track(won ? "game_won" : "game_lost", { mode, tries });
    },
    [mode, storage, analytics],
  );

  // --- Ações ----------------------------------------------------------------
  const makeGuess = useCallback(
    (animalId: string) => {
      setSession((prev) => {
        if (!prev || prev.status !== "playing" || prev.attempts.includes(animalId)) return prev;
        const attempts = [...prev.attempts, animalId];
        const won = animalId === prev.answer.id;
        const status: GameStatus = won ? "won" : "playing";
        const next: SessionState = { ...prev, attempts, status };
        persist(next);
        if (won) recordOutcome(true, attempts.length, prev.dateKey);
        return next;
      });
    },
    [persist, recordOutcome],
  );

  const giveUp = useCallback(() => {
    setSession((prev) => {
      if (!prev || prev.status !== "playing") return prev;
      const next: SessionState = { ...prev, status: "lost" };
      persist(next);
      recordOutcome(false, prev.attempts.length, prev.dateKey);
      return next;
    });
  }, [persist, recordOutcome]);

  const newGame = useCallback(() => {
    if (mode !== "infinite") return;
    setSession((prev) => {
      const id = randomAnimalId(prev?.answer.id);
      const answer = getAnimal(id);
      if (!answer) return prev;
      const fresh: SessionState = { answer, attempts: [], status: "playing" };
      saveInfinite(storage, { answerId: id, attempts: [], status: "playing" });
      return fresh;
    });
  }, [mode, storage]);

  // --- Derivados ------------------------------------------------------------
  const rows: GuessRow[] = useMemo(() => {
    if (!session) return [];
    const out: GuessRow[] = [];
    for (const id of session.attempts) {
      const animal = getAnimal(id);
      if (!animal) continue;
      out.push({
        animalId: id,
        nome: animal.nome,
        emoji: animal.emoji,
        cells: compareAnimals(animal, session.answer),
      });
    }
    return out;
  }, [session]);

  return {
    hydrated,
    mode,
    answer: session?.answer ?? null,
    attempts: session?.attempts ?? [],
    status: session?.status ?? "playing",
    rows,
    dayNumber: session?.dayNumber,
    stats,
    makeGuess,
    giveUp,
    newGame,
  };
}
