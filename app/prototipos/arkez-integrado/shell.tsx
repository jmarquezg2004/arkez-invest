import { ArrowDownRight, ArrowUpRight, Compass, LibraryBig } from "lucide-react";
import { Brand } from "@/components/brand";
import { contactLink, legalLinks, mainNavigation, type SiteLink } from "@/lib/navigation";
import { PreviewLinks } from "./preview-links";
import { base, previewHref } from "./routes";

const library = [
  { label: "Catálogo Explore", href: base + "/explore/" },
  { label: "Informes de empresas", href: base + "/research/" },
  { label: "Recursos de Nubank", href: base + "/explore/nubank/" },
  { label: "Cadena de valor de la IA", href: base + "/explore/ecosistema-ia/" },
];
const groups: readonly (SiteLink | (SiteLink & { children: readonly SiteLink[] }))[] = [
  ...mainNavigation,
  { label: "Explore y Research", href: base + "/explore/", children: library },
];

export function IntegratedShell({ children }: { children: React.ReactNode }) {
  return <div className="ai-preview">
    <header className="ai-preview-header">
      <div className="ai-preview-nav">
        <Brand href={base + "/"} />
        <details className="ai-preview-mobile"><summary>Menú <ArrowDownRight size={16} /></summary><Nav label="Menú móvil de Arkez" /></details>
        <div className="ai-preview-desktop"><Nav label="Menú principal de Arkez" /></div>
        <a className="ai-contact" href={previewHref(contactLink.href)}>Contacto <ArrowUpRight size={16} /></a>
      </div>
    </header>
    <PreviewLinks>{children}</PreviewLinks>
    <footer className="ai-preview-footer"><a href={base + "/"}>Arkez Invest</a><div>{legalLinks.map(({ label, href }) => <a key={href} href={previewHref(href)}>{label}</a>)}</div></footer>
  </div>;
}

function Nav({ label }: { label: string }) {
  return <nav aria-label={label}><a href={base + "/"}>Inicio</a>
    {groups.map((group) => "children" in group ? <details name={label} key={group.href}>
      <summary>{group.label}<ArrowDownRight size={14} /></summary>
      <div className="ai-preview-menu"><a href={previewHref(group.href)}>Ver {group.label.toLowerCase()}</a>
        {group.children.map(({ label: name, href }) => <a key={href} href={previewHref(href)}>{name}</a>)}
      </div>
    </details> : <a key={group.href} href={previewHref(group.href)}>{group.label}</a>)}
  </nav>;
}

export function ResearchEntry() {
  return <section className="ai-entry" aria-labelledby="ai-entry-title">
    <div className="container-shell">
      <p className="eyebrow">Explore y Research</p><h2 id="ai-entry-title">Entiende cómo funciona un negocio.</h2>
      <p>Recorre empresas, modelos de negocio y cadenas de valor. Cada informe separa los datos publicados de la explicación educativa.</p>
      <div className="ai-entry-links">
        <a href={base + "/explore/"}><Compass size={24} /><span>Explorar el catálogo</span><ArrowUpRight size={19} /></a>
        <a href={base + "/research/"}><LibraryBig size={24} /><span>Ver los informes</span><ArrowUpRight size={19} /></a>
      </div>
    </div>
  </section>;
}
