import { HomeSections } from "@/components/home-sections";
import { RevealSections } from "@/components/reveal-sections";
import { NexaExperience } from "../arkez-nexacore/experience";
import { ResearchEntry } from "./shell";
import { PreviewNews } from "./news";
import { StoryShelf } from "./visual-stories/story-library";
import { base, learningPathRoute } from "./routes";

export default function Page() {
  return <>
    <NexaExperience standalone={false} learningHref={base + learningPathRoute}><ResearchEntry /></NexaExperience>
    <div className="container-shell"><StoryShelf id="historias-inicio" items={["caja", "diversificacion", "fuentes"]} /></div>
    <RevealSections />
    <HomeSections news={<PreviewNews directory={base + "/actualidad/"} />} />
  </>;
}
