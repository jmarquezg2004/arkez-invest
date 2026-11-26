import type { Metadata } from "next";
import "@xyflow/react/dist/style.css";
import "../arkez-nexacore/experience.css";
import "../arkez-nexacore/v2.css";
import "@/arkez-visual-engine/design.css";
import "./integrated.css";
import "./learning-quiz.css";
import "./visual-stories/stories.css";
import { IntegratedShell } from "./shell";

export const metadata: Metadata = {
  title: "Arkez Invest · Vista previa del sitio completo",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <IntegratedShell>{children}</IntegratedShell>;
}
