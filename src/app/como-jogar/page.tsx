// Página de regras com exemplos reais de comparação.
import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import styles from "./como-jogar.module.css";
import Guess from "@/components/game/Guess";
import { Cell, GuessRow } from "@/lib/game/types";
import { AnimalGuess } from "@/components/game/AnimalGuess";

export const metadata: Metadata = {
  title: "Como Jogar",
  description: `Aprenda as regras do ${site.name}: descubra o animal secreto a partir de pistas coloridas sobre suas características.`,
  alternates: { canonical: "/como-jogar" },
};

const cells: Cell[] = [
  { key: 'classe', label: "Classe", tone: "green", hint: "✓ Igual" },
  { key: 'dieta', label: "Dieta", tone: "red", hint: "✗ Diferente" },
  { key: 'continentes', label: "Continentes", tone: "yellow", hint: "Parcial" },
  { key: 'habitat', label: "Habitat", tone: "red", hint: "✗ Diferente" },
  { key: 'pesoMedioKg', label: "Peso", tone: "yellow", hint: "↓ Mais leve" },
  { key: 'comprimentoCm', label: "Comprimento", tone: "green", hint: "≈ Igual" },
  { key: 'velocidadeMaxima', label: "Velocidade", tone: "yellow", hint: "↑ Mais rápido" },
];

const animal: GuessRow = {
  animalId: "urso-pardo",
  nome: "Urso-Pardo",
  emoji: "🐻",
  cells
}

export default function ComoJogarPage() {
  return (
    <article className={styles.page}>
      <h1>Como Jogar</h1>

      <p className={styles.lead}>
        <strong>Descubra o animal secreto.</strong> A cada chute, você recebe
        pistas coloridas comparando o seu palpite com o animal certo.
      </p>

      <section>
        <h2>As cores das pistas</h2>
        <ul className={styles.tones}>
          <li>
            <span className={`${styles.dot} ${styles.green}`} aria-hidden="true" />
            <span>
              <strong>Verde</strong> — igual ou muito próximo.
            </span>
          </li>
          <li>
            <span className={`${styles.dot} ${styles.yellow}`} aria-hidden="true" />
            <span>
              <strong>Amarelo</strong> — parcial ou perto. Há alguma coincidência,
              mas não total.
            </span>
          </li>
          <li>
            <span className={`${styles.dot} ${styles.red}`} aria-hidden="true" />
            <span>
              <strong>Vermelho</strong> — diferente. Essa característica não bate.
            </span>
          </li>
        </ul>
      </section>

      <section>
        <h2>Coincidências parciais</h2>
        <p>
          Dicas como <strong>continentes</strong>, <strong>habitat</strong> e{" "}
          <strong>dieta</strong> aceitam vários valores. Basta uma coincidência
          para a pista ficar <strong>amarela</strong> (Parcial).
        </p>
      </section>

      <section>
        <h2>Números e direção</h2>
        <p>
          Para <strong>peso</strong>, <strong>comprimento</strong>,{" "}
          <strong>velocidade</strong> e <strong>vida média</strong>, uma seta
          indica a direção do animal certo: <strong>↑</strong> maior / mais rápido
          / vive mais; <strong>↓</strong>, o oposto. <strong>Verde</strong> quando
          está perto (≈).
        </p>
      </section>

      <section>
        <h2>Exemplo real</h2>
        <p>
          Se o animal secreto for o <strong>Leão</strong> e você chutar{" "}
          <strong>Urso-pardo</strong>:
        </p>

        <AnimalGuess row={animal} attemptIndex={0} />

        <p className={styles.tip}>
          Dica: é um mamífero do mesmo tamanho do urso, mas carnívoro, mais rápido,
          mais pesado e da savana — quase um leão!
        </p>
      </section>

      <section>
        <h2>Os modos</h2>
        <p>
          <strong>Animal do Dia</strong>: o mesmo animal para todos, mudando à
          meia-noite (horário de Brasília). Acertou? Compartilhe o resultado em
          emojis. <strong>Modo Infinito</strong>: um animal aleatório por partida,
          para praticar à vontade.
        </p>
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
