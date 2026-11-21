import type { Metadata } from "next";
import { PremiumShowcase } from "@/components/premium-showcase/showcase";
import "./showcase.css";

export const metadata: Metadata = {
  title: "Design Showcase Premium · Arkez Invest",
  description: "Prototipo de diseño para revisión interna de Arkez Invest.",
  robots: { index: false, follow: false },
};

export default function DesignShowcasePage() {
  return <PremiumShowcase />;
}
