import type { Metadata } from "next";
import { ChevronRight, Globe2, SlidersHorizontal, Target } from "lucide-react";
import { FeatureGrid } from "@/components/feature-grid";
import { CapabilitiesPanel } from "@/components/capabilities-panel";
import { serviceCards } from "@/lib/content";
import { legacyLinks, siteDescription, siteName } from "@/lib/navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Arkez Invest | Educación, formación y consultoría financiera",
    description: siteDescription,
    url: "/",
    siteName,
    locale: "es",
    type: "website",
  },
};

const topics = [
  { label: "Mercados e instrumentos", href: "/servicios/#analisis-de-mercados", icon: Globe2 },
  { label: "Riesgo y diversificación", href: "/legal/riesgos/", icon: SlidersHorizontal },
  { label: "Objetivos y estrategia", href: "/servicios/metodologia/", icon: Target },
];

export default function Home() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="container-shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Educación, formación y consultoría</p>
            <h1 id="home-title">Conocimiento financiero <span>para tomar mejores decisiones.</span></h1>
            <p className="hero-description">Formación, análisis de mercados y herramientas tecnológicas para fortalecer tus capacidades financieras y de inversión.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="/servicios/">Explorar servicios</a>
              <a className="button button-outline" href="/nosotros/">Conoce Arkez</a>
            </div>
          </div>
          <CapabilitiesPanel />
        </div>
      </section>

      <nav aria-label="Temas de aprendizaje" className="topic-strip">
        <ul className="container-shell topic-grid">
          {topics.map(({ label, href, icon: Icon }) => (
            <li key={href}><a href={href}><Icon strokeWidth={1.7} size={23} aria-hidden="true" />{label}</a></li>
          ))}
        </ul>
      </nav>

      <section className="container-shell home-section" aria-labelledby="learn-title">
        <h2 className="section-title" id="learn-title">Nuestros servicios</h2>
        <p className="section-description">Desarrollamos capacidades financieras en personas y empresas con formación práctica, análisis y consultoría.</p>
        <FeatureGrid cards={serviceCards} />
      </section>

      <section className="audience-section" aria-labelledby="audience-title">
        <div className="container-shell audience-grid">
          <div>
            <p className="eyebrow">Para quién</p>
            <h2 className="section-title" id="audience-title">Distintos objetivos. Mejores preguntas.</h2>
          </div>
          <div className="audience-links">
            <a href="/para-quien/personas/">
              <span><strong>Personas</strong><span>Desarrolla habilidades para evaluar decisiones financieras.</span></span>
              <ChevronRight size={20} aria-hidden="true" />
            </a>
            <a href="/para-quien/empresas/">
              <span><strong>Empresas</strong><span>Fortalece el análisis y la planificación de tu empresa.</span></span>
              <ChevronRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="container-shell legacy-links" aria-labelledby="quick-title">
        <h2 id="quick-title">Accesos directos</h2>
        <ul>
          {legacyLinks.map(({ id, href, label }) => <li key={id} id={id}><a href={href}>{label}</a></li>)}
        </ul>
      </section>
    </>
  );
}
