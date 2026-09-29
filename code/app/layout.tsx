import type { Metadata } from "next";
import { Fraunces, Merriweather_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/company";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieProbe from "@/components/legal/CookieProbe";
import Tracking from "@/components/Tracking";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Noah",
  description:
    "Noah, the right hand man for transformation managers. An autonomous transformation agent helping you with improving your business processes.",
  openGraph: {
    type: "website",
    siteName: "Noah",
    url: "./",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "noah. The right hand man for the transformation manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${merriweatherSans.variable} h-full`}
    >
      <body className="min-h-full bg-noah-cream text-noah-ink font-body antialiased">
        <ScrollProgress />
        <Tracking />
        <CookieProbe />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
