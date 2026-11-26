import { StoryLibrary, StoryShelf } from "../visual-stories/story-library";
import { StoryStrip } from "../visual-stories/story-strip";
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
import { aiMapDownload, base, learningPathRoute, publicRoutes, researchRoutes, visualStoriesRoute } from "../routes";
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
  return [...publicRoutes, ...researchRoutes, learningPathRoute, visualStoriesRoute].map((path) => ({ ruta: path.split("/").filter(Boolean) }));
}

export default async function Page({ params }: { params: Promise<{ ruta: string[] }> }) {
  const { ruta } = await params;
  const path = `/${ruta.join("/")}/`;
  if (path === visualStoriesRoute) return <StoryLibrary />;
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
  if (path === "/explore/") return <div className="ve">
    <Explore market={<MarketLookup />} onMarketPath={base + "/research/"} />
    <div className="container-shell"><StoryShelf id="historias-explore" items={["fuentes", "inflacion", "diversificacion"]} /></div>
  </div>;
  if (path === "/explore/ecosistema-ia/") return <div className="ve"><AiChain directory={<AiCompanies downloadHref={aiMapDownload} />} /></div>;
  if (path === "/explore/nubank/") return <div className="ve"><ResearchIndex data={nubank} /></div>;
  if (ruta[0] === "explore" && ruta[1] === "nubank" && ruta.length === 3) {
    const resource = resourceTypes.find(({ id }) => id === ruta[2]);
    if (resource) return <div className="ve"><ResearchResource data={nubank} id={resource.id} /></div>;
  }
  if (path === "/research/") return <ReportLibrary />;
  if (path === "/research/oddity/") return <ReportLibrary companyOnly />;
  if (path === "/research/oddity/informe/" || path === "/research/oddity/modelo/") return <OddityReport model={path.endsWith("/modelo/")} />;
  if (path === "/innovacion/") return <main className="ai-inner"><InnovationPage /></main>;
  const page = pages[path];
  if (!page) notFound();
  const service = serviceEditorial(path);
  const reels = base + "/archivos/visual-stories/";
  const sectionExtras: Readonly<Record<string, React.ReactNode>> | undefined = path === "/recursos/guias/" ? {
    "comparar-escenarios": <StoryStrip story="escenarios" reelDirectory={reels} />,
    "liquidez-operativa": <StoryStrip story="caja" reelDirectory={reels} />,
    "revisar-fuentes": <StoryStrip story="fuentes" />,
  } : path === "/recursos/guias/primeros-pasos/" ? {
    "objetivo-fecha-fija": <StoryStrip story="plazos" />,
  } : path === "/recursos/articulos/" ? {
    inflacion: <StoryStrip story="inflacion" />,
  } : undefined;
  return <main className="ai-inner" data-service-tone={service?.tone}><ContentPage page={page} path={path}
    heroArt={service?.hero ?? <ArtImage art={sectionArtwork[ruta[0]] ?? "report"} eager />}
    heroActions={service?.intro}
    sectionExtras={sectionExtras}>
    {path === "/recursos/articulos/que-es-diversificar/" && <StoryStrip story="diversificacion" reelDirectory={reels} />}
    {path === "/actualidad/" && <PreviewNews directory={base + path} directoryPage />}
    {path === "/ecosistema/" ? <Ecosystem /> : service?.body ?? <CommercialPages path={path} />}
    {path === "/recursos/" && <><ResourceLibrary /><StoryShelf id="historias-recursos" items={["escenarios", "plazos", "inflacion"]} /></>}
    {path === "/herramientas/" && <StoryShelf id="historias-herramientas" items={["escenarios", "caja"]} />}
    {path === "/contacto/" && <p className="ai-contact-note">Vista previa para revisar el sitio. El envío de mensajes se habilita en la versión pública cuando esté disponible.</p>}
  </ContentPage></main>;
}
