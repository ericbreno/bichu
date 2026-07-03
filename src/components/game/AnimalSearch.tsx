"use client";

// Campo de busca de animais com dropdown e navegação por teclado.
// Filtra por nome/aliases (acentos/caixa irrelevantes) e omite já chutados.
import { useEffect, useRef, useState } from "react";
import { searchAnimals } from "@/data";
import type { Animal } from "@/lib/game/types";
import styles from "./AnimalSearch.module.css";

interface Props {
  excludeIds: string[];
  onPick: (id: string) => void;
  disabled?: boolean;
}

export function AnimalSearch({ excludeIds, onPick, disabled }: Props) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? searchAnimals(query, 7).filter((a) => !excludeIds.includes(a.id))
    : [];

  // Fecha o dropdown ao clicar fora.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function choose(animal: Animal) {
    onPick(animal.id);
    setQuery("");
    setOpen(false);
    setActive(0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[active];
      if (pick) choose(pick);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={styles.box} ref={boxRef}>
      <input
        className={styles.input}
        value={query}
        disabled={disabled}
        placeholder="Digite o nome de um animal…"
        autoComplete="off"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-autocomplete="list"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => query && setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {open && results.length > 0 && (
        <ul className={styles.list} role="listbox">
          {results.map((animal, i) => (
            <li key={animal.id}>
              <button
                type="button"
                className={`${styles.option} ${i === active ? styles.active : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(animal)}
                role="option"
                aria-selected={i === active}
              >
                <span className={styles.emoji} aria-hidden="true">
                  {animal.emoji ?? "🐾"}
                </span>
                <span>{animal.nome}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
