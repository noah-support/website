import Featured from "@/components/sections/Featured";
import TradeCompare from "@/components/trade/TradeCompare";
import TradeDemo from "@/components/trade/TradeDemo";
import TradeForm from "@/components/trade/TradeForm";
import TradeHero from "@/components/trade/TradeHero";
import TradeHow from "@/components/trade/TradeHow";
import { TRADE_META, TRADE_PROOF, TRADE_PROOF_EYEBROW } from "@/lib/trade";

export const metadata = {
  title: TRADE_META.title,
  description: TRADE_META.description,
};

export default function TradePage() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

  return (
    <main>
      <TradeHero recaptchaSiteKey={recaptchaSiteKey} />
      <Featured eyebrow={TRADE_PROOF_EYEBROW} outlets={TRADE_PROOF} />
      <TradeDemo />
      <TradeHow />
      <TradeCompare />
    </main>
  );
}
