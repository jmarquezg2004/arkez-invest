import { OddityVisualStory } from "../visual-stories/oddity-story";
import { storyForReading } from "../visual-stories/story-links";
import { StoryLibrary } from "../visual-stories/story-library";
import { ArtImage } from "@/arkez-visual-engine/components/art";
import type { Art } from "@/arkez-visual-engine/catalog";
import { notFound } from "next/navigation";
import { pages } from "@/lib/content";
import { ContentPage } from "@/components/content-page";
import { CommercialPages } from "@/components/commercial-pages";
import { ResourceLibrary } from "@/components/resource-library";
import { Explore } from "@/arkez-visual-engine/components/explore";
import { AiCompanies } from "@/arkez-visual-engine/components/ai-companies";
import { AiChain } from "@/arkez-visual-engine/components/ai-chain";
import { ResearchIndex, ResearchResource } from "@/arkez-visual-engine/templates/research";
import { nubank } from "@/arkez-visual-engine/research-data";
import { resourceTypes } from "@/arkez-visual-engine/schemas/research";
import InnovationPage from "@/app/innovacion/page";
import { ResearchCheckout } from "../research-checkout";
import { base, researchCheckoutRoute, learningPathRoute, oddityStoryPath, oddityStoryRoute, publicRoutes, researchRoutes, visualStoriesPath, visualStoriesRoute } from "../routes";
import { serviceEditorial } from "../service-editorial";
import { Ecosystem } from "../ecosystem";
import { MarketLookup } from "../market-lookup";
import { PreviewNews } from "../news";
import { LearningQuiz } from "../learning-quiz";
import { OddityReport, ReportLibrary } from "../reports";

const sectionArtwork: Record<string, Art> = {
  servicios: "study", herramientas: "report", recursos: "report", nosotros: "globe",
  actualidad: "globe", ecosistema: "chain", "para-quien": "study", contacto: "globe", legal: "security",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [...publicRoutes, ...researchRoutes, learningPathRoute].map((path) => ({ ruta: path.split("/").filter(Boolean) }));
}

export default async function Page({ params }: { params: Promise<{ ruta: string[] }> }) {
  const { ruta } = await params;
  const path = `/${ruta.join("/")}/`;
  if (path === visualStoriesRoute) return <StoryLibrary />;
  if (path === oddityStoryRoute) return <OddityVisualStory />;
  if (path === "/visual-stories/" || path === "/explore/oddity/") {
    const oddity = path === "/explore/oddity/";
    return <main className="avs-library"><div className="container-shell">
      <h1>{oddity ? "ODDITY en cuatro viñetas" : "Arkez Visual Stories"}</h1>
      <p>Esta lectura ahora está en Arkez Research.</p>
      <a className="avs-reading-link" href={oddity ? oddityStoryPath : visualStoriesPath}>{oddity ? "Leer la historia de ODDITY" : "Abrir la colección de historias"}</a>
    </div></main>;
  }
  if (path === learningPathRoute) return <main className="ai-quiz">
    <div className="container-shell ai-quiz-layout">
      <header className="ai-quiz-intro">
        <p className="eyebrow">Formación financiera</p>
        <h1>Encuentra tu ruta de aprendizaje</h1>
        <p>Responde cinco o seis preguntas y descubre por dónde empezar con las guías, los casos y los simuladores de Arkez.</p>
        <a href={base + "/recursos/"}>Explorar recursos por mi cuenta</a>
      </header>
      <LearningQuiz base={base} />
    </div>
  </main>;
  if (path === "/explore/") return <div className="ve"><Explore market={<MarketLookup />} onMarketPath={base + "/research/"} /></div>;
  if (path === "/explore/ecosistema-ia/") return <div className="ve"><AiChain directory={<AiCompanies />} /></div>;
  if (path === "/explore/nubank/") return <div className="ve"><ResearchIndex data={nubank} /></div>;
  if (ruta[0] === "explore" && ruta[1] === "nubank" && ruta.length === 3) {
    const resource = resourceTypes.find(({ id }) => id === ruta[2]);
    if (resource) return <div className="ve"><ResearchResource data={nubank} id={resource.id} /></div>;
  }
  if (path === researchCheckoutRoute) return <ResearchCheckout />;
  if (path === "/research/") return <ReportLibrary />;
  if (path === "/research/oddity/") return <ReportLibrary companyOnly />;
  if (path === "/research/oddity/informe/" || path === "/research/oddity/modelo/") return <OddityReport model={path.endsWith("/modelo/")} />;
  if (path === "/innovacion/") return <main className="ai-inner"><InnovationPage /></main>;
  const page = pages[path];
  if (!page) notFound();
  const service = serviceEditorial(path);
  const readingStories = Object.fromEntries((page.sections ?? []).flatMap(({ id }) => {
    const href = id && storyForReading(path + "#" + id);
    return href ? [[id, <a className="avs-reading-link" href={href}>Ver el ejemplo ilustrado en Research</a>]] : [];
  }));
  const relatedStory = storyForReading(path);
  return <main className="ai-inner" data-service-tone={service?.tone}><ContentPage page={page} path={path}
    heroArt={service?.hero ?? <ArtImage art={sectionArtwork[ruta[0]] ?? "report"} eager />}
    heroActions={service?.intro} sectionExtras={readingStories}>
    {path === "/actualidad/" && <PreviewNews directory={base + path} directoryPage />}
    {path === "/ecosistema/" ? <Ecosystem /> : service?.body ?? <CommercialPages path={path} />}
    {path === "/recursos/" && <><ResourceLibrary /><a className="avs-reading-link" href={visualStoriesPath}>Explorar historias y reels en Research</a></>}
    {relatedStory && <a className="avs-reading-link" href={relatedStory}>Ver la historia relacionada en Research</a>}
    {path === "/contacto/" && <p className="ai-contact-note">Vista previa para revisar el sitio. El envío de mensajes se habilita en la versión pública cuando esté disponible.</p>}
  </ContentPage></main>;
}
