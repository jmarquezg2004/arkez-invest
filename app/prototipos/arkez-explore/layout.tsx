import type { Metadata } from "next";
import "@/arkez-visual-engine/design.css";

export const metadata: Metadata = {
  title: "Arkez Explore · Vista previa",
  description: "Explora empresas, recursos de investigación y cadenas de valor.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
