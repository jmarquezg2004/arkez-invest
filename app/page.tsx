import type { Metadata } from "next";
import { ChevronRight, Globe2, SlidersHorizontal, Target } from "lucide-react";
import { FeatureGrid } from "@/components/feature-grid";
import { PortfolioExample } from "@/components/portfolio-example";
import { educationCard, guidesCard, methodologyCard } from "@/lib/content";
import { educationLink, legacyLinks, siteName } from "@/lib/navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Arkez Invest | Educación financiera",
    description: "Entiende los mercados, evalúa el riesgo y aprende a tomar decisiones financieras con mayor criterio.",
    url: "/",
    siteName,
    locale: "es",
    type: "website",
  },
};

const topics = [
  { label: "Mercados e instrumentos", href: educationLink.href, icon: Globe2 },
  { label: "Riesgo y diversificación", href: "/legal/riesgos/", icon: SlidersHorizontal },
  { label: "Objetivos y estrategia", href: "/servicios/metodologia/", icon: Target },
];

export default function Home() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="container-shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Educación financiera</p>
            <h1 id="home-title">Invierte con <span>más criterio.</span></h1>
            <p className="hero-description">Entiende cómo funcionan los mercados, evalúa el riesgo y aprende a tomar decisiones financieras con mayor claridad.</p>
            <div className="hero-actions">
              <a className="button button-dark" href={educationLink.href}>Explorar educación</a>
              <a className="button button-outline" href="/nosotros/">Conoce Arkez</a>
            </div>
          </div>
          <PortfolioExample />
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
        <p className="eyebrow">Aprende con Arkez</p>
        <h2 className="section-title" id="learn-title">La base para decidir mejor.</h2>
        <p className="section-description">Empieza por los fundamentos y pasa de la teoría a preguntas que puedas aplicar en tu día a día.</p>
        <FeatureGrid cards={[educationCard, methodologyCard, guidesCard]} />
      </section>

      <section className="audience-section" aria-labelledby="audience-title">
        <div className="container-shell audience-grid">
          <div>
            <p className="eyebrow">Para quién</p>
            <h2 className="section-title" id="audience-title">Distintos objetivos. Mejores preguntas.</h2>
          </div>
          <div className="audience-links">
            <a href="/para-quien/personas/">
              <span><strong>Personas</strong><span>Ordena tus objetivos y revisa los riesgos.</span></span>
              <ChevronRight size={20} aria-hidden="true" />
            </a>
            <a href="/para-quien/empresas/">
              <span><strong>Empresas</strong><span>Explora liquidez, planificación y horizontes.</span></span>
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
