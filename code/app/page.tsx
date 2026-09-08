import OpeningHero from "@/components/sections/OpeningHero";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";
import Vision from "@/components/sections/Vision";
import Clients from "@/components/sections/Clients";
import Featured from "@/components/sections/Featured";
import Features from "@/components/sections/Features";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main>
      <OpeningHero />
      <Problem />
      <Solution />
      <Vision />
      <div className="h-[80vh]" aria-hidden />
      <Pricing />
      <Clients />
      <Featured />
      <Features />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
