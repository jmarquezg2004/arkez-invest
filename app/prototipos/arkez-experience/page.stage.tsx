import type { Metadata } from "next";
import { ArkezExperience } from "@/components/arkez-experience/experience";
import "./experience.css";

export const metadata: Metadata = {
  title: "Arkez Experience · Prototipo de producto",
  description: "Experiencia de revisión para aprender, evaluar y aplicar tecnología financiera.",
  robots: { index: false, follow: false },
};

export default function ExperiencePage() {
  return <ArkezExperience />;
}
