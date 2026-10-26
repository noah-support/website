"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

export default function UtmCapture() {
  const pathname = usePathname();

  useEffect(() => {
    captureUtm();
  }, [pathname]);

  return null;
}
