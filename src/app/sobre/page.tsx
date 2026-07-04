// Página "Sobre": apresentação rápida do projeto e contatos do autor.
import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import styles from "./sobre.module.css";

export const metadata: Metadata = {
  title: "Sobre",
  description: `Conheça o ${site.name}, um jogo de adivinhação de animais, e entre em contato com o criador.`,
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <article className={styles.page}>
      <h1>Sobre</h1>

      <p className={styles.lead}>
        O <strong>{site.name}</strong> é um jogo de adivinhação de animais. A cada
        chute, você recebe pistas coloridas comparando o seu palpite com o animal
        secreto — classe, dieta, habitat, peso, velocidade e muito mais.
      </p>

      <section>
        <h2>Como nasceu</h2>
        <p>
          Uma brincadeira inspirada em jogos como <strong>Wordle</strong> e{" "}
          <strong>Termo</strong>, mas com bichos.
        </p>
      </section>

      <section>
        <h2>Contato</h2>
        <p>
          <strong>{site.author.name}</strong>
        </p>
        <ul className={styles.contacts}>
          {/* <li>
            <span className={styles.icon} aria-hidden="true">✉️</span>
            <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
          </li> */}
          <li>
            <span className={styles.icon} aria-hidden="true">💼</span>
            <a
              href={site.author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ({site.author.linkedinHandle})
            </a>
          </li>
        </ul>
      </section>

      <div className={styles.cta}>
        <Link href="/diario" className="btn btn-primary btn-block">
          🐾 Jogar Animal do Dia
        </Link>
        <Link href="/infinito" className="btn btn-secondary btn-block">
          ∞ Jogar Modo Infinito
        </Link>
        <Link href="/" className={styles.back}>
          ← Voltar ao início
        </Link>
      </div>
    </article>
  );
}
