import type { Metadata } from "next";
import { ArrowDown, ArrowRight, BookOpen, Building2, Compass, Layers3, TrendingUp, Users } from "lucide-react";
import { InnovationPreview } from "@/components/innovation/innovation-preview";
import { LearningLab } from "@/components/learning-lab";
import { RevealSections } from "@/components/reveal-sections";
import { StructuredData } from "@/components/structured-data";
import { methodologySteps, serviceCards } from "@/lib/content";
import { legacyLinks } from "@/lib/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/");

const serviceIcons = [BookOpen, TrendingUp, Layers3, Compass];

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
      <StructuredData path="/" />
      <RevealSections />
      <section className="experience-hero" aria-labelledby="home-title">
        <div className="container-shell experience-intro">
          <div className="experience-copy">
            <p className="eyebrow">Educación, formación y consultoría</p>
            <h1 id="home-title">Conocimiento financiero <span>para tomar mejores decisiones.</span></h1>
            <p className="experience-description">Formación, análisis de mercados y herramientas tecnológicas para fortalecer tus capacidades financieras y de inversión.</p>
            <div className="hero-actions">
              <a className="button button-gold" href="/servicios/">Explorar servicios<ArrowRight size={18} aria-hidden="true" /></a>
              <a className="button button-ghost" href="/nosotros/">Conoce Arkez</a>
            </div>
          </div>
          <div className="hero-art">
            <img src="/brand/prisma-980.webp" srcSet="/brand/prisma-540.webp 540w, /brand/prisma-980.webp 980w" sizes="(max-width: 760px) 94vw, 52vw" width="980" height="784" alt="" fetchPriority="high" />
            <figure className="hero-plot">
              <figcaption><span>Lectura de mercados</span><span>Serie ficticia</span></figcaption>
              <svg viewBox="0 0 320 86" aria-hidden="true">
                <path className="hero-plot-grid" d="M0 14H320 M0 42H320 M0 70H320 M54 0V86 M109 0V86 M164 0V86 M219 0V86 M274 0V86" />
                <path className="hero-plot-line" pathLength="1" d="M1 64 27 56 54 67 78 47 109 52 138 33 164 42 192 25 219 28 246 11 274 19 311 7" />
                <circle cx="311" cy="7" r="4" />
              </svg>
              <a href="#laboratorio">Probar el ejercicio<ArrowDown size={15} aria-hidden="true" /></a>
            </figure>
          </div>
        </div>
      </section>

      <section className="experience-laboratory section-spacing" id="laboratorio" aria-labelledby="lab-heading">
        <div className="container-shell">
          <div className="experience-section-heading" data-reveal>
            <div><p className="eyebrow">Laboratorio educativo</p><h2 id="lab-heading">Cambia un supuesto.<br />Observa qué cambia.</h2></div>
            <p>Prueba cuatro ejercicios y compara resultados antes de aplicar un criterio a tus finanzas. Gráficos ilustrativos con fines educativos.</p>
          </div>
          <LearningLab />
        </div>
      </section>

      <section className="container-shell experience-services section-spacing" aria-labelledby="learn-title">
        <figure className="services-photo" data-reveal>
          <img src="/brand/estudio-980.webp" srcSet="/brand/estudio-540.webp 540w, /brand/estudio-980.webp 980w" sizes="(max-width: 880px) 90vw, 42vw" width="980" height="1200" alt="" loading="lazy" />
        </figure>
        <div data-reveal>
          <p className="eyebrow">Servicios</p>
          <h2 id="learn-title">Aprender, analizar y aplicar.</h2>
          <p className="experience-section-description">Desarrollamos capacidades financieras en personas y empresas con formación práctica, análisis y consultoría.</p>
          <ul className="experience-service-list" role="list">
            {serviceCards.map(({ href, label, description }, index) => {
              const Icon = serviceIcons[index];
              return <li key={href}>
                <a href={href}>
                  <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                  <div><h3>{label}</h3><p>{description}</p></div>
                  <ArrowRight size={20} aria-hidden="true" />
                </a>
              </li>;
            })}
          </ul>
        </div>
      </section>

      <InnovationPreview />

      <section className="experience-audiences section-spacing" aria-labelledby="audience-title">
        <div className="container-shell" data-reveal>
          <p className="eyebrow">Para quién</p>
          <h2 id="audience-title">Decisiones distintas.<br />Mejores preguntas.</h2>
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
                <a href={href} className="audience-link">{link}<ArrowRight size={16} aria-hidden="true" /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="experience-method section-spacing" aria-labelledby="methodology-title">
        <div className="container-shell methodology-section" data-reveal>
          <div>
            <p className="eyebrow">Cómo trabajamos</p>
            <h2 id="methodology-title">Nuestra metodología</h2>
            <p className="section-description">Partimos de tus objetivos y revisamos cómo aplicas lo aprendido a una decisión financiera.</p>
            <a href="/servicios/metodologia/" className="button button-ghost">Conoce la metodología<ArrowRight size={18} aria-hidden="true" /></a>
          </div>
          <ol className="methodology-steps" role="list">
            {methodologySteps.map(({ title, body }, index) => (
              <li key={title}>
                <span className="methodology-step" aria-hidden="true">{index + 1}</span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="experience-library section-spacing" aria-labelledby="home-library-title">
        <div className="container-shell library-feature">
          <div data-reveal>
            <p className="eyebrow">Biblioteca Arkez</p>
            <h2 id="home-library-title">Lleva la práctica contigo.</h2>
            <p className="experience-section-description">Encuentra guías, casos y hojas de cálculo para seguir aprendiendo a tu ritmo.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="/recursos/">Explorar la biblioteca<ArrowRight size={18} aria-hidden="true" /></a>
              <a className="hero-guide" href="/recursos/guias/primeros-pasos/">Guía para empezar a invertir</a>
            </div>
          </div>
          <div className="library-showcase" data-reveal>
            <a href="/recursos/guias/primeros-pasos/" aria-label="Leer Primeros pasos para invertir"><img src="/recursos/portadas/primeros-pasos-para-invertir.webp" alt="" width="240" height="340" loading="lazy" /></a>
            <a href="/recursos/guias/#comparar-escenarios" aria-label="Consultar el Laboratorio financiero en Excel"><img src="/recursos/portadas/laboratorio-financiero.webp" alt="" width="240" height="340" loading="lazy" /></a>
            <a href="/recursos/articulos/#lectura-de-mercados" aria-label="Leer Cómo leer un movimiento de mercado"><img src="/recursos/portadas/lectura-de-mercados.webp" alt="" width="240" height="340" loading="lazy" /></a>
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
