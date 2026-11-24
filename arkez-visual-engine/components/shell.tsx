import { ArrowUpRight, Compass, FileChartColumn, Layers3 } from "lucide-react";
import brand from "../brand-config.json";

export const base = brand.prototype;
export function Shell({ children, section = "explore" }: { children: React.ReactNode; section?: "explore" | "research" | "ia" }) {
  return <div className="ve" data-section={section} lang={brand.locale}>
    <header className="ve-top"><div className="ve-top-inner">
      <a className="ve-brand" href={base}><span aria-hidden="true" />{brand.name}</a>
      <nav aria-label="Navegación de Arkez Explore">
        <a href={base} aria-current={section === "explore" ? "page" : undefined}><Compass size={18} /> Explorar</a>
        <a href={base + "nubank/"} aria-current={section === "research" ? "page" : undefined}><FileChartColumn size={18} /> Research</a>
        <a href={base + "ecosistema-ia/"} aria-current={section === "ia" ? "page" : undefined}><Layers3 size={18} /> Cadena de IA</a>
      </nav>
      <a className="ve-return" href="/prototipos/arkez-nexacore/">Volver a NexaCore <ArrowUpRight size={15} /></a>
    </div></header>
    {children}
    <footer className="ve-footer"><a href={base}>{brand.name}</a><span>Educación financiera aplicada</span><a href="/prototipos/arkez-nexacore/">NexaCore <ArrowUpRight size={15} /></a></footer>
  </div>;
}
