import AboutJoin from "@/components/about/AboutJoin";
import AboutMission from "@/components/about/AboutMission";
import AboutTeam from "@/components/about/AboutTeam";

export const metadata = {
  title: "About us — Noah",
  description:
    "Noah interviews, maps, and prices the fix. Meet the team behind one department at a time.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutMission />
      <AboutTeam />
      <AboutJoin />
    </main>
  );
}
