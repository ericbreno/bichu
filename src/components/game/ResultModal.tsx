"use client";

// Modal de fim de partida (vitória ou derrota): revela o animal, permite
// compartilhar e, no Modo Infinito, iniciar nova partida. No Diário, mostra
// uma contagem regressiva até o próximo animal (meia-noite de Brasília).
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ShareButton } from "./ShareButton";
import { ShareImageButton } from "./ShareImageButton";
import { brtDateString } from "@/lib/date";
import { buildShareParts, buildShareText } from "@/lib/game/share";
import type { Animal, GameMode, GuessRow } from "@/lib/game/types";
import type { Stats } from "@/lib/game/stats";
import styles from "./ResultModal.module.css";
import { site } from "@/config/site";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: GameMode;
  won: boolean;
  answer: Animal;
  tries: number;
  dayNumber?: number;
  rows: GuessRow[];
  stats: Stats;
  onNewGame?: () => void;
}

/** Contagem regressiva até a próxima meia-noite de Brasília. */
function Countdown() {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      // Próxima meia-noite de Brasília: meia-noite de hoje + 1 dia (BRT não tem
      // horário de verão, então somar 24h é seguro). Antes somávamos 1 dia em
      // UTC, o que, ao voltar para BRT (UTC-3), caía no dia anterior.
      const todayKey = brtDateString(now);
      const nextMs = Date.parse(`${todayKey}T00:00:00-03:00`) + 86_400_000;
      let diff = Math.max(0, nextMs - now.getTime());
      const h = Math.floor(diff / 3_600_000);
      diff -= h * 3_600_000;
      const min = Math.floor(diff / 60_000);
      diff -= min * 60_000;
      const s = Math.floor(diff / 1000);
      setRemaining(
        `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className={styles.countdown}>{remaining}</span>;
}

export function ResultModal({
  open,
  onClose,
  mode,
  won,
  answer,
  tries,
  dayNumber,
  rows,
  stats,
  onNewGame,
}: Props) {
  const title = won ? "Você acertou! 🎉" : "Não foi dessa vez";

  const parts = buildShareParts({ mode, dayNumber, rows, link: site.domain });
  const shareText = () => buildShareText(parts);

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className={styles.reveal}>
        <span className={styles.emoji} aria-hidden="true">
          {answer.emoji ?? "🐾"}
        </span>
        <div>
          <p className={styles.answerName}>{answer.nome}</p>
          <p className={styles.answerMeta}>
            {answer.classe} · {answer.dieta.join(", ")}
          </p>
        </div>
      </div>

      {won ? (
        <p className={styles.tries}>
          Acertou em <strong>{tries}</strong> {tries === 1 ? "tentativa" : "tentativas"}!
        </p>
      ) : (
        <p className={styles.tries}>O animal correto era este. Tente de novo!</p>
      )}

      <div className={styles.miniStats}>
        <span>Partidas: {stats.played}</span>
        <span>Acerto: {Math.round((stats.played ? stats.wins / stats.played : 0) * 100)}%</span>
        <span>Sequência: {stats.currentStreak}</span>
      </div>

      <div className={styles.actions}>
        <ShareButton getText={shareText} />
        <ShareImageButton parts={parts} getText={shareText} />
        {mode === "infinite" && onNewGame ? (
          <button type="button" className="btn btn-secondary btn-block" onClick={onNewGame}>
            🔄 Jogar de novo
          </button>
        ) : (
          <p className={styles.next}>
            Próximo animal em <Countdown />
          </p>
        )}
      </div>
    </Modal>
  );
}
