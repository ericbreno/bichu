// Modo Animal do Dia: mesmo animal para todos, mudando à meia-noite de Brasília.
import type { Metadata } from "next";
import { GameBoard } from "@/components/game/GameBoard";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Animal do Dia",
  description: `Jogue o Animal do Dia do ${site.name}: o mesmo animal para todos, com novo desafio todo dia à meia-noite.`,
  alternates: { canonical: "/diario" },
};

export default function DailyPage() {
  return <GameBoard mode="daily" />;
}
