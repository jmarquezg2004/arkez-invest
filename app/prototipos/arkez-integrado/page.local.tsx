import { HomeSections } from "@/components/home-sections";
import { RevealSections } from "@/components/reveal-sections";
import { NexaExperience } from "../arkez-nexacore/experience";
import { ResearchEntry } from "./shell";

export default function Page() {
  return <>
    <NexaExperience standalone={false}><ResearchEntry /></NexaExperience>
    <RevealSections />
    <HomeSections />
  </>;
}
