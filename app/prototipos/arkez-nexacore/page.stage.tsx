import type { Metadata } from "next";
import { NexaExperience } from "./experience";
import "@xyflow/react/dist/style.css";
import "./experience.css";
import "./v2.css";

export const metadata: Metadata = {
  title: "Arkez Invest · Experiencia de revisión",
  description: "Educación financiera aplicada, simuladores y tecnología para tomar decisiones con más criterio.",
  robots: { index: false, follow: false },
};

export default function NexaPage() {
  return <NexaExperience />;
}
