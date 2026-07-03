import Link from "next/link";
import { site } from "@/config/site";
import styles from "./Logo.module.css";

// Marca (wordmark) com um pequeno símbolo. Voltar para a home ao clicar.
export function Logo() {
  return (
    <Link href="/" className={styles.logo} aria-label={`${site.name} — voltar ao início`}>
      <span className={styles.mark} aria-hidden="true" />
      <span className={styles.word}>{site.name}</span>
    </Link>
  );
}
