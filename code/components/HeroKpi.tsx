"use client";

import { useEffect, useState } from "react";
import GlassPane from "@/components/GlassPane";
import { useLiveCounter } from "@/lib/useLiveCounter";
import { useReducedMotion } from "@/lib/useReducedMotion";

const ALERTS = [
  "New bottleneck flagged in Finance approvals queue",
  "Onboarding hand-off delay detected — Support, EU team",
  "Duplicate process found in Procurement and Legal",
];

function formatCurrency(value: number) {
  if (value >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(3)} M`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatHours(value: number) {
  return `${Math.round(value).toLocaleString("en-US")} hrs`;
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <GlassPane as="div" className="flex flex-col gap-2 p-4 sm:p-5">
      <p className="font-body text-[11px] leading-snug text-noah-ink-dim">
        {label}
      </p>
      <p className="font-body text-2xl font-semibold tabular-nums whitespace-nowrap text-noah-ink sm:text-3xl">
        {value}
      </p>
      <p className="font-body text-[11px] text-noah-orange">
        ▲ live, updating
      </p>
    </GlassPane>
  );
}

type HeroKpiProps = {
  moneyStart?: number;
  hoursStart?: number;
  alerts?: string[];
};

export default function HeroKpi({
  moneyStart = 482000,
  hoursStart = 1240,
  alerts = ALERTS,
}: HeroKpiProps) {
  const reducedMotion = useReducedMotion();
  const money = useLiveCounter(moneyStart, { reduced: reducedMotion });
  const hours = useLiveCounter(hoursStart, { reduced: reducedMotion });
  const [alertIndex, setAlertIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setAlertIndex((i) => (i + 1) % alerts.length);
    }, 4800);
    return () => window.clearInterval(id);
  }, [reducedMotion, alerts.length]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3 sm:gap-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <KpiCard
          label="Potential money savings identified"
          value={formatCurrency(money)}
        />
        <KpiCard
          label="Potential time saved identified"
          value={formatHours(hours)}
        />
      </div>

      <GlassPane as="div" className="flex items-center gap-3 p-4 sm:p-5">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-noah-orange opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-noah-orange" />
        </span>
        <p
          key={alertIndex}
          className="alert-fade-in font-body text-[13px] leading-snug text-noah-ink"
        >
          {alerts[alertIndex]}
        </p>
      </GlassPane>
    </div>
  );
}
