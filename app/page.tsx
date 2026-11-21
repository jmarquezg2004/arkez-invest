import type { Metadata } from "next";
import { AllocationMark, BusinessMark, EducationMark, MarketMark, TechnologyMark } from "@/components/arkez-icons";
import { RevealSections } from "@/components/reveal-sections";
import { StructuredData } from "@/components/structured-data";
import { offers } from "@/lib/commercial-offers";
import { calculatorLink, ecosystemLink, innovationLink, newsLink } from "@/lib/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/");
const serviceIcons = [EducationMark, MarketMark, BusinessMark];
const benefits = [
  { title: "Practica antes de decidir", text: "Compara alternativas con casos y datos de ejemplo." },
  { title: "Haz mejores preguntas", text: "Identifica qué costos, plazos y riesgos conviene revisar." },
  { title: "Aplica lo aprendido", text: "Usa guías y herramientas en tus finanzas o con tu equipo." },
];

export default function Home() {
  return (
    <>
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
            <img src="/brand/prisma-980.webp" srcSet="/brand/prisma-540.webp 540w, /brand/prisma-720.webp 720w, /brand/prisma-980.webp 980w" sizes="(max-width: 760px) 100vw, 58vw" width="980" height="784" alt="" fetchPriority="high" />
            <div className="hero-light" aria-hidden="true" />
            <svg className="hero-register" viewBox="0 0 900 650" aria-hidden="true" preserveAspectRatio="none">
              <path d="M140 494H260L371 414H517L662 303H824"/>
              <path d="M306 500H448L503 461H635L718 401H870"/>
            </svg>
          </div>
        </div>
      </section>

      <section className="container-shell experience-services section-spacing" id="portafolio" aria-labelledby="learn-title">
        <figure className="services-photo" data-reveal>
          <img src="/brand/estudio-980.webp" srcSet="/brand/estudio-540.webp 540w, /brand/estudio-980.webp 980w" sizes="(max-width: 880px) 90vw, 42vw" width="980" height="1200" alt="" loading="lazy" />
        </figure>
        <div data-reveal>
          <h2 id="learn-title">Elige qué quieres aprender</h2>
          <ul className="experience-service-list" role="list">
            {offers.slice(0, 3).map(({ href, title, summary }, index) => {
              const Icon = serviceIcons[index];
              return <li key={href}>
                <a href={href}>
                  <Icon size={22} />
                  <div><h3>{title}</h3><p>{summary}</p></div>
                </a>
              </li>;
            })}
          </ul>
          <a className="commercial-text-link" href="/servicios/consultoria-financiera/">Consultar por acompañamiento financiero</a>
        </div>
      </section>

      <section className="commercial-tool section-spacing" id="laboratorio" aria-labelledby="home-tool-title">
        <div className="container-shell commercial-split" data-reveal>
          <div>
            <p className="eyebrow">Herramienta gratuita</p>
            <h2 id="home-tool-title">Calculadora de interés compuesto</h2>
            <p>Descubre cómo pueden crecer tus ahorros con el tiempo. Prueba cuánto cambia el resultado si ajustas tus aportes, el plazo o la tasa.</p>
          </div>
          <div className="commercial-tool-action">
            <AllocationMark size={38} />
            <a className="button button-gold" href={calculatorLink.href}>Probar calculadora</a>
            <a href="/herramientas/#laboratorio">Abrir el laboratorio financiero</a>
          </div>
        </div>
      </section>

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

      <section className="experience-library section-spacing" id="noticias" aria-labelledby="home-library-title">
        <div className="container-shell library-feature">
          <div data-reveal>
            <h2 id="home-library-title">Noticias, guías y plantillas</h2>
            <p className="experience-section-description">Consulta fuentes de actualidad o practica a tu ritmo con los recursos de Arkez.</p>
            <div className="hero-actions">
              <a className="button button-dark" href={newsLink.href}>Ver actualidad</a>
              <a className="button button-outline" href="/recursos/">Explorar recursos</a>
            </div>
          </div>
          <div className="library-showcase" data-reveal>
            <a href="/recursos/guias/primeros-pasos/" aria-label="Leer Primeros pasos para invertir"><img src="/recursos/portadas/primeros-pasos-para-invertir.webp" alt="" width="240" height="340" loading="lazy" /></a>
            <a href="/recursos/guias/#comparar-escenarios" aria-label="Consultar el Laboratorio financiero en Excel"><img src="/recursos/portadas/laboratorio-financiero.webp" alt="" width="240" height="340" loading="lazy" /></a>
            <a href="/recursos/articulos/#lectura-de-mercados" aria-label="Leer Cómo leer un movimiento de mercado"><img src="/recursos/portadas/lectura-de-mercados.webp" alt="" width="240" height="340" loading="lazy" /></a>
          </div>
        </div>
      </section>

      <section className="container-shell commercial-ecosystem section-spacing" id="innovacion" aria-labelledby="home-ecosystem-title">
        <div className="commercial-split" data-reveal>
          <div>
            <h2 id="home-ecosystem-title">Explora el ecosistema financiero</h2>
            <p>Encuentra fuentes, plataformas de información y eventos del sector en un directorio de sitios oficiales.</p>
          </div>
          <div className="commercial-ecosystem-links">
            <TechnologyMark size={34} />
            <a className="commercial-text-link" href={ecosystemLink.href} id="explorar-innovacion">Consultar el directorio</a>
            <a className="commercial-text-link" href={innovationLink.href} id="practicar-innovacion">Visitar Innovation Hub</a>
          </div>
        </div>
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
