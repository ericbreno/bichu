// Modo Infinito: animal sorteado a cada partida; jogue quantas vezes quiser.
import type { Metadata } from "next";
import { GameBoard } from "@/components/game/GameBoard";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Modo Infinito",
  description: `Pratique sem limites no Modo Infinito do ${site.name}: um animal aleatório a cada partida.`,
  alternates: { canonical: "/infinito" },
};

export default function InfinitePage() {
  return <GameBoard mode="infinite" />;
}
