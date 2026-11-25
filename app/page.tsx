import type { Metadata } from "next";
import { ArrowDown } from "@/components/arkez-icons";
import { MarketTrace } from "@/components/charts/financial-graphics";
import { RevealSections } from "@/components/reveal-sections";
import { HomeSections } from "@/components/home-sections";
import { StructuredData } from "@/components/structured-data";
import { calculatorLink } from "@/lib/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/");
const mobileHeroSources = "/brand/prisma-540.webp 540w, /brand/prisma-720.webp 720w";
const desktopHeroSources = `${mobileHeroSources}, /brand/prisma-980.webp 980w`;
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

      <HomeSections />
    </>
  );
}
