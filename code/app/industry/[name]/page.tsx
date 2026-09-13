import Featured from "@/components/sections/Featured";
import FinalCTA from "@/components/sections/FinalCTA";
import Pricing from "@/components/sections/Pricing";
import IndustryCompare from "@/components/industry/IndustryCompare";
import IndustryHero from "@/components/industry/IndustryHero";
import IndustryHow from "@/components/industry/IndustryHow";
import IndustryPartnerFit from "@/components/industry/IndustryPartnerFit";
import IndustryPartnerForm from "@/components/industry/IndustryPartnerForm";
import IndustryPartnerHero from "@/components/industry/IndustryPartnerHero";
import IndustryPartnerHow from "@/components/industry/IndustryPartnerHow";
import IndustryPartnerReasons from "@/components/industry/IndustryPartnerReasons";
import IndustryPlaceholder from "@/components/industry/IndustryPlaceholder";
import { getIndustry, INDUSTRIES } from "@/lib/industries";
import { PARTNER_PROOF } from "@/lib/partner";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ name: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const industry = getIndustry(name);
  if (!industry) return { title: "Industries - Noah" };
  return { title: `${industry.name} - Noah` };
}

export default async function IndustryNamePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const industry = getIndustry(name);
  if (!industry) notFound();

  if (industry.kind === "placeholder") {
    return <IndustryPlaceholder name={industry.name} />;
  }

  if (industry.kind === "partner") {
    return (
      <main>
        <IndustryPartnerHero industry={industry} />
        <Featured eyebrow="" outlets={PARTNER_PROOF} />
        <IndustryPartnerReasons />
        <IndustryPartnerFit />
        <IndustryPartnerHow />
        <IndustryPartnerForm recaptchaSiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""} />
      </main>
    );
  }

  return (
    <main>
      <IndustryHero industry={industry} />
      <Featured
        eyebrow={industry.featuredEyebrow}
        outlets={industry.featured}
      />
      <IndustryCompare />
      <IndustryHow industry={industry} />
      <Pricing />
      <FinalCTA eyebrow={industry.cta.eyebrow} title={industry.cta.title} />
    </main>
  );
}
