"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, LibraryMark, TechnologyMark, ChevronDown, CounselMark, Menu, X } from "@/components/arkez-icons";
import { Brand } from "./brand";
import { contactLink, mainNavigation, type SiteLink } from "@/lib/navigation";

const menuIntroductions: Partial<Record<string, { icon: typeof CounselMark; description: string }>> = {
  "/servicios/": { icon: CounselMark, description: "Formación, análisis y consultoría para desarrollar capacidades financieras." },
  "/herramientas/": { icon: TechnologyMark, description: "Prueba calculadoras y ejercicios gratuitos con tus propios supuestos." },
  "/recursos/": { icon: LibraryMark, description: "Estudia con guías, artículos y herramientas listas para usar." },
  "/nosotros/": { icon: CounselMark, description: "Conoce nuestra misión, nuestro enfoque y cómo trabajamos." },
};

const menuDescriptions: Record<string, string> = {
  "/herramientas/interes-compuesto/": "Calcula cuánto podrías acumular",
  "/herramientas/#laboratorio": "Aprende con cuatro ejercicios",
  "/innovacion/#simulador": "Compara dos carteras ficticias",
  "/innovacion/": "Explora la tecnología en finanzas",
  "/ecosistema/": "Consulta el directorio de plataformas",
  "/para-quien/": "Encuentra formación para ti o para tu equipo",
  "/servicios/educacion-financiera/": "Bases para evaluar decisiones",
  "/servicios/analisis-de-mercados/": "Indicadores, fuentes y contexto",
  "/servicios/formacion-practica/": "Ejercicios y herramientas aplicadas",
  "/servicios/consultoria-financiera/": "Criterios para organizar alternativas",
  "/servicios/metodologia/": "Del diagnóstico a la evaluación",
  "/para-quien/personas/": "Objetivos, presupuesto e inversión",
  "/para-quien/empresas/": "Liquidez, escenarios y decisiones de equipo",
  "/recursos/guias/": "Casos, ejercicios y plantillas",
  "/recursos/articulos/": "Lecturas sobre mercados y finanzas",
  "/recursos/preguntas-frecuentes/": "Respuestas para orientarte",
  "/nosotros/mision-y-equipo/": "Identidad institucional",
  "/nosotros/transparencia/": "Alcance y principios de trabajo",
};

function MenuLink({ link, pathname }: { link: SiteLink; pathname: string }) {
  return (
    <a href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
      {link.label}
    </a>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeMenus(event: PointerEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        header.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((menu) => {
          menu.open = false;
        });
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      const focused = document.activeElement;
      const open = Array.from(header.current?.querySelectorAll<HTMLDetailsElement>("details[open]") ?? []);
      const menu = open.reverse().find((item) => focused && item.contains(focused))
        ?? open.find((item) => item.offsetWidth > 0);

      if (menu) {
        event.preventDefault();
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header ref={header} className="site-header">
      <div className="container-shell header-inner">
        <Brand />
        <nav aria-label="Navegación principal" className="desktop-nav">
          <a className="nav-link" href="/" aria-current={pathname === "/" ? "page" : undefined}>Inicio</a>
          {mainNavigation.map((group) => {
            if (!("children" in group)) return <a className="nav-link" key={group.href} href={group.href} aria-current={pathname === group.href ? "page" : undefined}>{group.label}</a>;
            const introduction = menuIntroductions[group.href] ?? { icon: CounselMark, description: group.label };
            const Icon = introduction.icon;
            return (
              <details className="nav-group" name="desktop-navigation" key={group.href}>
                <summary className="nav-link" data-current={pathname.startsWith(group.href) || group.children.some(({ href }) => pathname === href)}>
                  {group.label}<ChevronDown size={14} aria-hidden="true" />
                </summary>
                <div className="nav-dropdown">
                  <div className="mega-introduction">
                    <Icon size={23} aria-hidden="true" />
                    <p>{introduction.description}</p>
                    <MenuLink link={{ ...group, label: `Ver ${group.label.toLowerCase()}` }} pathname={pathname} />
                  </div>
                  <ul className="mega-links" role="list">
                    {group.children.map((link) => <li key={link.href}>
                      <a href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
                        <span><strong>{link.label}</strong><small>{menuDescriptions[link.href]}</small></span>
                        <ArrowRight size={17} aria-hidden="true" />
                      </a>
                    </li>)}
                  </ul>
                </div>
              </details>
            );
          })}
        </nav>
        <a className="button button-header desktop-contact" href={contactLink.href} aria-current={pathname === contactLink.href ? "page" : undefined}>
          {contactLink.label}
        </a>
        <details className="mobile-menu">
          <summary className="mobile-toggle">
            <Menu size={23} className="menu-icon" aria-hidden="true" />
            <X size={23} className="close-icon" aria-hidden="true" />
            <span>Menú</span>
          </summary>
          <nav aria-label="Navegación móvil" className="mobile-panel">
            <MenuLink link={{ label: "Inicio", href: "/" }} pathname={pathname} />
            {mainNavigation.map((group) => "children" in group ? (
              <details className="mobile-group" name="mobile-navigation" key={group.href}>
                <summary>{group.label}<ChevronDown size={16} aria-hidden="true" /></summary>
                <ul>
                  <li><MenuLink link={{ ...group, label: `Ver ${group.label.toLowerCase()}` }} pathname={pathname} /></li>
                  {group.children.map((link) => <li key={link.href}><MenuLink link={link} pathname={pathname} /></li>)}
                </ul>
              </details>
            ) : <MenuLink key={group.href} link={group} pathname={pathname} />)}
            <MenuLink link={contactLink} pathname={pathname} />
          </nav>
        </details>
      </div>
    </header>
  );
}
