import type { Metadata } from "next";
import { ArrowDown, ArrowRight, BusinessMark, ChainMark, EducationMark, MarketMark, MoveUpRight, TechnologyMark } from "@/components/arkez-icons";
import { MarketTrace } from "@/components/charts/financial-graphics";
import { CompactCompound } from "@/components/compact-compound";
import { HomeServiceArt } from "@/components/home-service-art";
import { InnovationPreview } from "@/components/innovation/innovation-preview";
import { LearningLabDisclosure } from "@/components/learning-lab-disclosure";
import { RevealSections } from "@/components/reveal-sections";
import { StructuredData } from "@/components/structured-data";
import { offers } from "@/lib/commercial-offers";
import { ecosystemSections, editorialNews } from "@/lib/external-directory";
import { calculatorLink, ecosystemLink, newsLink } from "@/lib/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/");
const serviceIcons = [EducationMark, MarketMark, BusinessMark];
const serviceActions = ["Explorar el curso", "Ver la formación", "Ver opciones para empresas"];
const featuredPlatforms = [
  { ...ecosystemSections[0].sources[0], icon: MarketMark, category: "Mercados" },
  { ...ecosystemSections[1].sources[0], icon: ChainMark, category: "Activos digitales" },
  { ...ecosystemSections[2].sources[0], icon: TechnologyMark, category: "Fintech" },
  { ...ecosystemSections[3].sources[0], icon: EducationMark, category: "Formación" },
];
const mobileHeroSources = "/brand/prisma-540.webp 540w, /brand/prisma-720.webp 720w";
const desktopHeroSources = `${mobileHeroSources}, /brand/prisma-980.webp 980w`;
const readingDate = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const benefits = [
  { title: "Practica antes de decidir", text: "Compara alternativas con casos y datos de ejemplo." },
  { title: "Haz mejores preguntas", text: "Identifica qué costos, plazos y riesgos conviene revisar." },
  { title: "Aplica lo aprendido", text: "Usa guías y herramientas en tus finanzas o con tu equipo." },
];

export default function Home() {
  return (
    <>
      <link rel="preload" as="image" media="(max-width: 760px)" imageSrcSet={mobileHeroSources} imageSizes="100vw" fetchPriority="high" />
      <link rel="preload" as="image" media="(min-width: 760.01px)" imageSrcSet={desktopHeroSources} imageSizes="58vw" fetchPriority="high" />
      <StructuredData path="/" />
      <RevealSections />
      <section className="experience-hero commercial-hero" aria-labelledby="home-title">
        <div className="container-shell experience-intro">
          <div className="experience-copy">
            <p className="eyebrow">Educación y consultoría financiera</p>
            <h1 id="home-title">Aprende a manejar mejor tu dinero y <span>tomar decisiones financieras con confianza.</span></h1>
            <p className="experience-description">Cursos prácticos, herramientas gratuitas y orientación financiera para personas y empresas.</p>
            <div className="hero-actions">
              <a className="button button-gold" href="/servicios/">Explorar servicios</a>
              <a className="button button-ghost" href={calculatorLink.href}>Probar calculadora</a>
            </div>
          </div>
          <div className="hero-art">
            <picture>
              <source media="(max-width: 760px)" srcSet={mobileHeroSources} sizes="100vw" />
              <img src="/brand/prisma-980.webp" srcSet={desktopHeroSources} sizes="58vw" width="980" height="784" alt="" fetchPriority="high" />
            </picture>
            <div className="hero-light" aria-hidden="true" />
            <svg className="hero-register" viewBox="0 0 900 650" aria-hidden="true" preserveAspectRatio="none">
              <path d="M140 494H260L371 414H517L662 303H824"/>
              <path d="M306 500H448L503 461H635L718 401H870"/>
            </svg>
            <figure className="hero-plot">
              <figcaption><span>Lectura de mercados</span><span>Serie ficticia</span></figcaption>
              <div className="hero-market-close"><strong>114</strong><span>puntos de índice · base 100</span></div>
              <MarketTrace readings={[100, 104, 102, 109, 106, 112, 108, 114]} />
              <a href="#laboratorio">Probar un ejercicio<ArrowDown size={15} aria-hidden="true" /></a>
            </figure>
          </div>
        </div>
      </section>

      <section className="container-shell home-services section-spacing" id="portafolio" aria-labelledby="learn-title">
        <div className="home-services-heading" data-reveal>
          <h2 id="learn-title">Elige qué quieres aprender</h2>
          <a className="commercial-text-link" href="/servicios/consultoria-financiera/">Consultar por acompañamiento financiero</a>
        </div>
        <ul className="home-service-grid" role="list" data-reveal>
          {offers.slice(0, 3).map(({ href, title, summary }, index) => {
            const Icon = serviceIcons[index];
            return <li key={href} className="home-service-card" data-service-tone={index}>
              <div className="home-service-visual">
                <span className="home-service-icon"><Icon size={26} /></span>
                <HomeServiceArt index={index} />
              </div>
              <div className="home-service-copy">
                <h3>{title}</h3>
                <p>{summary}</p>
                <a href={href}>{serviceActions[index]}<ArrowRight size={17} aria-hidden="true" /></a>
              </div>
            </li>;
          })}
        </ul>
      </section>

      <section className="commercial-tool home-tool section-spacing" id="laboratorio" aria-labelledby="home-tool-title">
        <div className="container-shell">
          <div className="home-tool-grid">
            <div className="home-tool-copy" data-reveal>
              <p className="eyebrow">Herramienta gratuita</p>
              <h2 id="home-tool-title">Calcula cómo podrían crecer tus ahorros</h2>
              <p>Cambia el aporte o el plazo y mira cómo evoluciona el resultado.</p>
              <a className="button button-gold" href={calculatorLink.href}>Abrir calculadora completa</a>
            </div>
            <CompactCompound />
          </div>
          <LearningLabDisclosure />
        </div>
      </section>

      <InnovationPreview compact />

      <section className="experience-audiences section-spacing" id="clientes" aria-labelledby="audience-title">
        <div className="container-shell" data-reveal>
          <h2 id="audience-title">Qué puedes hacer con lo que aprendes</h2>
          <ul className="commercial-benefits" role="list">
            {benefits.map(({ title, text }) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}
          </ul>
          <div className="hero-actions">
            <a className="commercial-text-link" href="/para-quien/personas/">Formación para personas</a>
            <a className="commercial-text-link" href="/para-quien/empresas/">Formación para empresas</a>
            <a className="commercial-text-link" href="/servicios/metodologia/">Cómo enseñamos</a>
          </div>
        </div>
      </section>

      <section className="home-reading section-spacing" id="noticias" aria-labelledby="home-library-title">
        <div className="container-shell">
          <div className="home-services-heading" data-reveal>
            <h2 id="home-library-title">Actualidad y recursos</h2>
            <a className="commercial-text-link" href={newsLink.href}>Ver toda la actualidad</a>
          </div>
          <div className="home-reading-grid" data-reveal>
            <ul className="home-news-list" role="list">
              {Object.values(editorialNews).slice(0, 2).map(({ title, href, date, source }) => (
                <li key={href}>
                  <p>{source} · <time dateTime={date}>{readingDate.format(new Date(date))}</time></p>
                  <h3><a href={href}>{title}<MoveUpRight size={17} aria-hidden="true" /></a></h3>
                </li>
              ))}
            </ul>
            <article className="home-resource">
              <img src="/recursos/portadas/primeros-pasos-para-invertir.webp" alt="" width="240" height="340" loading="lazy" />
              <div>
                <h3>Guías y plantillas</h3>
                <a href="/recursos/guias/primeros-pasos/">Leer Primeros pasos para invertir</a>
                <a className="commercial-text-link" href="/recursos/">Explorar recursos</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="container-shell home-platforms section-spacing" id="ecosistema" aria-labelledby="home-ecosystem-title">
        <div className="home-services-heading" data-reveal>
          <h2 id="home-ecosystem-title">Explora el ecosistema financiero</h2>
          <a className="commercial-text-link" href={ecosystemLink.href}>Consultar el directorio</a>
        </div>
        <ul className="home-platform-list" role="list" data-reveal>
          {featuredPlatforms.map(({ name, href, icon: Icon, category }) => (
            <li key={href}><a href={href}>
              <span className="home-platform-mark"><Icon size={25} /></span>
              <span><strong>{name}</strong><small>{category}</small></span>
              <MoveUpRight size={16} aria-hidden="true" />
            </a></li>
          ))}
        </ul>
      </section>

      <section className="commercial-contact section-spacing" id="contacto" aria-labelledby="home-contact-title">
        <div className="container-shell commercial-split" data-reveal>
          <div>
            <h2 id="home-contact-title">¿Qué quieres aprender?</h2>
            <p>Consulta las opciones de formación o consultoría según tus objetivos.</p>
          </div>
          <div className="hero-actions">
            <a className="button button-gold" href="/contacto/">Solicitar información</a>
            <a className="button button-ghost" id="mision" href="/nosotros/mision-y-equipo/">Conocer a Arkez</a>
          </div>
        </div>
      </section>
    </>
  );
}
