import type { Metadata } from "next";
import NotFoundScene from "@/components/NotFoundScene";

export const metadata: Metadata = {
  title: "Page not found - Noah",
  description:
    "This page never made it onto the map. Head home, or pick an industry to walk through.",
};

export default function NotFound() {
  return <NotFoundScene />;
}
