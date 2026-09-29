import dynamic from "next/dynamic";
import OpeningHero from "@/components/sections/OpeningHero";
import Featured from "@/components/sections/Featured";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";

const Vision = dynamic(() => import("@/components/sections/Vision"));
const Pricing = dynamic(() => import("@/components/sections/Pricing"));
const Clients = dynamic(() => import("@/components/sections/Clients"));
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));

export default function Home() {
  return (
    <main>
      <OpeningHero />
      <Featured />
      <Problem />
      <Solution />
      <Vision />
      <Pricing />
      <Clients />
      <FinalCTA />
    </main>
  );
}
