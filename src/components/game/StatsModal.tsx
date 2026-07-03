"use client";

// Modal de Estatísticas. Reaproveita o Modal genérico e o StatsPanel.
import { Modal } from "@/components/ui/Modal";
import { StatsPanel } from "./StatsPanel";
import type { Stats } from "@/lib/game/stats";

interface Props {
  open: boolean;
  onClose: () => void;
  stats: Stats;
}

export function StatsModal({ open, onClose, stats }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Estatísticas">
      <StatsPanel stats={stats} />
    </Modal>
  );
}
