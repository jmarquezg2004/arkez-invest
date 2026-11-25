import { notFound } from "next/navigation";
import { pages } from "@/lib/content";
import { ContentPage } from "@/components/content-page";
import { CommercialPages } from "@/components/commercial-pages";
import { ResourceLibrary } from "@/components/resource-library";
import { Explore } from "@/arkez-visual-engine/components/explore";
import { AiChain } from "@/arkez-visual-engine/components/ai-chain";
import { ResearchIndex, ResearchResource } from "@/arkez-visual-engine/templates/research";
import { nubank } from "@/arkez-visual-engine/research-data";
import { resourceTypes } from "@/arkez-visual-engine/schemas/research";
import InnovationPage from "@/app/innovacion/page";
import { base, learningPathRoute, publicRoutes, researchRoutes } from "../routes";
import { PreviewNews } from "../news";
import { LearningQuiz } from "../learning-quiz";
import { OddityReport, ReportLibrary } from "../reports";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...publicRoutes, ...researchRoutes, learningPathRoute].map((path) => ({ ruta: path.split("/").filter(Boolean) }));
}

export default async function Page({ params }: { params: Promise<{ ruta: string[] }> }) {
  const { ruta } = await params;
  const path = `/${ruta.join("/")}/`;
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
  if (path === "/explore/") return <div className="ve"><Explore /></div>;
  if (path === "/explore/ecosistema-ia/") return <div className="ve"><AiChain /></div>;
  if (path === "/explore/nubank/") return <div className="ve"><ResearchIndex data={nubank} /></div>;
  if (ruta[0] === "explore" && ruta[1] === "nubank" && ruta.length === 3) {
    const resource = resourceTypes.find(({ id }) => id === ruta[2]);
    if (resource) return <div className="ve"><ResearchResource data={nubank} id={resource.id} /></div>;
  }
  if (path === "/research/") return <ReportLibrary />;
  if (path === "/research/oddity/") return <ReportLibrary companyOnly />;
  if (path === "/research/oddity/informe/" || path === "/research/oddity/modelo/") return <OddityReport model={path.endsWith("/modelo/")} />;
  if (path === "/innovacion/") return <InnovationPage />;
  const page = pages[path];
  if (!page) notFound();
  return <ContentPage page={page} path={path}>
    {path === "/actualidad/" && <PreviewNews directory={base + path} directoryPage />}
    <CommercialPages path={path} />
    {path === "/recursos/" && <ResourceLibrary />}
    {path === "/contacto/" && <p className="ai-contact-note">Vista previa para revisar el sitio. El envío de mensajes se habilita en la versión pública cuando esté disponible.</p>}
  </ContentPage>;
}
