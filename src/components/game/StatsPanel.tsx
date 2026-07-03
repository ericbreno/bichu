"use client";

// Painel de estatísticas do jogador. Puro apresentacional a partir de `Stats`.
import { averageTries, winRate, type Stats } from "@/lib/game/stats";
import styles from "./StatsPanel.module.css";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export function StatsPanel({ stats }: { stats: Stats }) {
  const rate = Math.round(winRate(stats) * 100);
  const avg = averageTries(stats);
  const maxTries = Object.keys(stats.distribution).reduce(
    (m, k) => Math.max(m, Number(k)),
    0,
  );
  const maxCount = Object.values(stats.distribution).reduce(
    (m, n) => Math.max(m, n),
    0,
  );

  return (
    <div>
      <div className={styles.grid}>
        <Stat value={String(stats.played)} label="Partidas" />
        <Stat value={String(stats.wins)} label="Vitórias" />
        <Stat value={String(stats.losses)} label="Derrotas" />
        <Stat value={`${rate}%`} label="Acerto" />
        <Stat value={avg > 0 ? avg.toFixed(1) : "—"} label="Média tent." />
        <Stat value={String(stats.maxStreak)} label="Recorde" />
        <Stat value={String(stats.currentStreak)} label="Sequência" />
      </div>

      <h3 className={styles.subtitle}>Tentativas até acertar</h3>
      {maxTries === 0 ? (
        <p className={styles.emptyDist}>Sem vitórias registradas ainda.</p>
      ) : (
        <div className={styles.dist}>
          {Array.from({ length: maxTries }, (_, i) => i + 1).map((tries) => {
            const count = stats.distribution[tries] ?? 0;
            const width = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
            return (
              <div key={tries} className={styles.distRow}>
                <span className={styles.distTries}>{tries}</span>
                <div className={styles.distBar}>
                  <span
                    className={styles.distFill}
                    style={{ width: `${Math.max(width, count > 0 ? 8 : 0)}%` }}
                  >
                    {count > 0 ? count : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
