"use client";

// Tela inicial do jogo. Carrega as estatísticas (para o modal) e o nº do Diário.
import Link from "next/link";
import { useEffect, useState } from "react";
import { StatsModal } from "@/components/game/StatsModal";
import { getDailyInfo } from "@/lib/game/daily";
import { EMPTY_STATS, type Stats } from "@/lib/game/stats";
import { loadStats } from "@/lib/game/storage";
import { useStorage } from "@/modules/storage/storage-context";
import { site } from "@/config/site";
import styles from "./page.module.css";

export default function HomePage() {
  const storage = useStorage();
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [statsOpen, setStatsOpen] = useState(false);
  const [dayNumber, setDayNumber] = useState<number | null>(null);

  useEffect(() => {
    setStats(loadStats(storage));
    setDayNumber(getDailyInfo().dayNumber);
  }, [storage]);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.mark} aria-hidden="true">
          🐾
        </div>
        <h1 className={styles.title}>{site.name}</h1>
        <p className={styles.tagline}>
          Descubra o animal secreto. A cada chute, pistas sobre classe, dieta,
          habitat, peso e muito mais.
        </p>
      </section>

      <nav className={styles.menu} aria-label="Modos de jogo">
        <Link href="/diario" className="btn btn-primary btn-block">
          🐾 Animal do Dia{dayNumber ? ` #${dayNumber}` : ""}
        </Link>
        <Link href="/infinito" className="btn btn-secondary btn-block">
          ∞ Modo Infinito
        </Link>
        <Link href="/como-jogar" className="btn btn-ghost btn-block">
          ❓ Como Jogar
        </Link>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          onClick={() => setStatsOpen(true)}
        >
          📊 Estatísticas
        </button>
      </nav>

      <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)} stats={stats} />
    </div>
  );
}
