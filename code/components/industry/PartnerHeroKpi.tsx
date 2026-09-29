"use client";

import { useEffect, useState } from "react";
import GlassPane from "@/components/GlassPane";
import { PARTNER_HERO_DEMO } from "@/lib/partner";
import { useLiveCounter } from "@/lib/useLiveCounter";
import { useReducedMotion } from "@/lib/useReducedMotion";

function formatCount(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <GlassPane as="div" className="flex flex-col gap-2 p-4 sm:p-5">
      <p className="font-body text-[10px] leading-snug text-noah-ink-dim sm:text-[11px]">
        {label}
      </p>
      <p className="font-body text-xl font-semibold tabular-nums whitespace-nowrap text-noah-ink sm:text-3xl">
        {value}
      </p>
      <p className="font-body text-[10px] text-noah-orange sm:text-[11px]">▲ live, updating</p>
    </GlassPane>
  );
}

export default function PartnerHeroKpi() {
  const reducedMotion = useReducedMotion();
  const interviews = useLiveCounter(PARTNER_HERO_DEMO.interviewsStart, {
    reduced: reducedMotion,
  });
  const cases = useLiveCounter(PARTNER_HERO_DEMO.casesStart, {
    reduced: reducedMotion,
  });
  const [alertIndex, setAlertIndex] = useState(0);
  const [live, setLive] = useState(false);
  const alerts = PARTNER_HERO_DEMO.alerts;

  useEffect(() => {
    setLive(true);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setAlertIndex((i) => (i + 1) % alerts.length);
    }, 4800);
    return () => window.clearInterval(id);
  }, [reducedMotion, alerts.length]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3 sm:gap-4">
      <GlassPane as="div" className="flex items-center gap-3 p-4 sm:p-5">
        <span className="relative flex h-2 w-2 shrink-0">
          {live && !reducedMotion ? (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-noah-orange opacity-60" />
          ) : null}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-noah-orange" />
        </span>
        <p
          key={alertIndex}
          className={`${live && alertIndex > 0 ? "alert-fade-in " : ""}font-body text-xs leading-snug text-noah-ink sm:text-[13px]`}
        >
          {alerts[alertIndex]}
        </p>
      </GlassPane>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <KpiCard
          label={PARTNER_HERO_DEMO.interviewsLabel}
          value={formatCount(interviews)}
        />
        <KpiCard
          label={PARTNER_HERO_DEMO.casesLabel}
          value={formatCount(cases)}
        />
      </div>
    </div>
  );
}
