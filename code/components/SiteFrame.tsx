"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import CookieBanner from "@/components/legal/CookieBanner";
import CookieProbe from "@/components/legal/CookieProbe";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import UtmCapture from "@/components/marketing/UtmCapture";
import ScrollProgress from "@/components/ScrollProgress";
import Tracking from "@/components/Tracking";

export default function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");
  const flow = pathname === "/f" || pathname.startsWith("/f/");

  return (
    <>
      {admin ? null : (
        <>
          <CookieBanner />
          <Tracking />
          <UtmCapture />
          <CookieProbe />
        </>
      )}
      {admin || flow ? null : <ScrollProgress />}
      {admin || flow ? null : <Header />}
      {children}
      {admin || flow ? null : <Footer />}
    </>
  );
}
