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
    <section className="ai-question container-shell" aria-labelledby="ai-question-title">
      <h2 id="ai-question-title">¿Qué te cuesta entender del mercado o de las inversiones?</h2>
      <p>Empieza con una explicación breve, una viñeta o un ejercicio guiado.</p>
      <a className="nx-button nx-button-learning" href={base + learningPathRoute}>Encuentra tu ruta de aprendizaje</a>
    </section>
    <HomeSections news={<PreviewNews directory={base + "/actualidad/"} />} />
  </>;
}
