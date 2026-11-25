import { HomeSections } from "@/components/home-sections";
import { RevealSections } from "@/components/reveal-sections";
import { NexaExperience } from "../arkez-nexacore/experience";
import { ResearchEntry } from "./shell";
import { PreviewNews } from "./news";
import { base, learningPathRoute } from "./routes";

export default function Page() {
  return <>
    <NexaExperience standalone={false} learningHref={base + learningPathRoute}><ResearchEntry /></NexaExperience>
    <RevealSections />
    <HomeSections news={<PreviewNews directory={base + "/actualidad/"} />} />
  </>;
}
