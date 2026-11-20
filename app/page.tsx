import type { Metadata } from "next";
import { Building2, Globe2, SlidersHorizontal, Target, Users } from "lucide-react";
import { FeatureGrid } from "@/components/feature-grid";
import { CapabilitiesPanel } from "@/components/capabilities-panel";
import { methodologySteps, serviceCards } from "@/lib/content";
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

const audiences = [
  {
    title: "Personas",
    description: "Criterios para tomar decisiones sobre tus propias finanzas.",
    benefits: [
      "Ordena objetivos de ahorro, financiación e inversión.",
      "Compara costos, plazos y riesgos de las alternativas.",
      "Aprende a interpretar fuentes e indicadores financieros.",
    ],
    href: "/para-quien/personas/",
    link: "Conoce el enfoque para personas",
    icon: Users,
  },
  {
    title: "Empresas",
    description: "Un marco para analizar decisiones financieras con tu equipo.",
    benefits: [
      "Relaciona los compromisos de pago con la liquidez operativa.",
      "Evalúa cómo cambian las decisiones en distintos escenarios.",
      "Documenta supuestos y criterios para la planificación.",
    ],
    href: "/para-quien/empresas/",
    link: "Conoce el enfoque para empresas",
    icon: Building2,
  },
] as const;

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
        <FeatureGrid cards={serviceCards} variant="services" />
      </section>

      <section className="audience-section" aria-labelledby="audience-title">
        <div className="container-shell">
          <h2 className="section-title" id="audience-title">Para quién</h2>
          <div className="audience-grid">
            {audiences.map(({ title, description, benefits, href, link, icon: Icon }) => (
              <article className="audience-card" key={href}>
                <div className="audience-heading">
                  <span className="feature-icon"><Icon size={22} strokeWidth={1.65} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                </div>
                <p>{description}</p>
                <ul className="audience-benefits" role="list">
                  {benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                </ul>
                <a href={href} className="audience-link">{link}</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell home-section methodology-section" aria-labelledby="methodology-title">
        <div>
          <h2 className="section-title" id="methodology-title">Nuestra metodología</h2>
          <p className="section-description">Partimos de tus objetivos y revisamos cómo aplicas lo aprendido a una decisión financiera.</p>
          <a href="/servicios/metodologia/" className="button button-outline">Conoce la metodología</a>
        </div>
        <ol className="methodology-steps" role="list">
          {methodologySteps.map(({ title, body }, index) => (
            <li key={title}>
              <span className="methodology-step" aria-hidden="true">{index + 1}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </li>
          ))}
        </ol>
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
