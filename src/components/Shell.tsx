import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import { AdSlot } from "./AdSlot";
import { Logo } from "./Logo";
import styles from "./Shell.module.css";

// Shell da aplicação: cabeçalho (logo + navegação), conteúdo principal e
// rodapé (espaço reservado para anúncio + marca).
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Logo />
        <nav className={styles.nav}>
          <Link href="/como-jogar" className={styles.link}>Como Jogar</Link>
          <Link href="/sobre" className={styles.link}>Sobre</Link>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <AdSlot slot="footer" />
        <p className={styles.copy}>© {site.name}</p>
      </footer>
    </div>
  );
}
