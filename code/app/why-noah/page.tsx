import type { Metadata } from "next";
import Features from "@/components/sections/Features";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Y Noah — Noah",
  description:
    "Built from real interviews, priced instead of theoretical, and fully autonomous.",
};

export default function YNoahPage() {
  return (
    <main className="pt-28 sm:pt-32">
      <div className="mx-auto max-w-3xl px-6 pb-12 text-center sm:px-16 sm:pb-16">
        <h1 className="font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl">
          Why Noah
        </h1>
      </div>
      <Features />
      <FinalCTA />
    </main>
  );
}
