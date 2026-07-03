// Legenda compacta das cores e setas usadas nas pistas.
import styles from "./Legend.module.css";

const SWATCHES: { tone: string; label: string }[] = [
  { tone: "green", label: "Igual" },
  { tone: "yellow", label: "Parcial / perto" },
  { tone: "red", label: "Diferente / longe" },
];

export function Legend() {
  return (
    <div className={styles.legend}>
      <ul className={styles.swatches}>
        {SWATCHES.map((s) => (
          <li key={s.tone} className={styles.item}>
            <span className={styles.swatch} data-tone={s.tone} aria-hidden="true" />
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
      <p className={styles.note}>
        Setas <strong>↑</strong> / <strong>↓</strong> indicam a direção (peso, tamanho,
        velocidade e vida) do animal correto em relação ao seu chute.
      </p>
    </div>
  );
}
