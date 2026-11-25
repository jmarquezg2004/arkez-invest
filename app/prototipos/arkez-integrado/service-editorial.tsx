import { ArrowUpRight, BookOpen, Building2, ChartNoAxesCombined, ClipboardList, Compass, GraduationCap, Users } from "lucide-react";
import { inquiryHref, offers } from "@/lib/commercial-offers";
import { ArtImage } from "@/arkez-visual-engine/components/art";
import type { Art } from "@/arkez-visual-engine/catalog";
import { previewHref } from "./routes";

const serviceScenes = {
  "educacion-financiera": { art: "report", tone: "sand", Icon: BookOpen, title: "Primeros pasos para invertir", label: "Leer la guía", href: "/recursos/guias/primeros-pasos/" },
  "analisis-de-mercados": { art: "study", tone: "blue", Icon: ChartNoAxesCombined, title: "Explora un gráfico de mercado", label: "Consultar un ticker", href: "/prototipos/arkez-integrado/research/#consultar-ticker" },
  "finanzas-empresariales": { art: "chain", tone: "teal", Icon: Building2, title: "¿Qué pasa si un cobro se retrasa?", label: "Abrir caso de flujo de caja", href: "/recursos/guias/#liquidez-operativa" },
  "consultoria-financiera": { art: "globe", tone: "blue", Icon: Compass, title: "Compara dos escenarios", label: "Ver el ejercicio", href: "/recursos/guias/#comparar-escenarios" },
  "formacion-practica": { art: "chip", tone: "teal", Icon: ClipboardList, title: "Laboratorio financiero", label: "Descargar plantilla Excel", href: "/recursos/archivos/laboratorio-financiero.xlsx" },
} as const satisfies Record<(typeof offers)[number]["id"], { art: Art; tone: string; Icon: typeof Compass; title: string; label: string; href: string }>;

export function serviceEditorial(path: string) {
  const offer = offers.find(({ href }) => href === path);
  if (!offer) return null;
  const scene = serviceScenes[offer.id];
  const { Icon, art, tone, title, label, href } = scene;
  return {
    tone,
    hero: <ArtImage art={art} eager />,
    intro: <div className="ai-service-actions">
      <a href={previewHref(href)} className="ve-cta">{label} <ArrowUpRight size={17} aria-hidden="true" /></a>
      <a href="#offer-heading">Qué incluye el servicio</a>
    </div>,
    body: <section className="ai-service-overview" aria-labelledby="offer-heading">
      <div className="ai-service-summary">
        <h2 id="offer-heading">Qué incluye el servicio</h2>
        <p>{offer.contents}</p>
        <dl>
          <div><Users size={21} aria-hidden="true" /><dt>Para quién</dt><dd>{offer.audience}</dd></div>
          <div><ClipboardList size={21} aria-hidden="true" /><dt>Qué te llevas</dt><dd>{offer.outcome}</dd></div>
          <div><GraduationCap size={21} aria-hidden="true" /><dt>Modalidad</dt><dd>{offer.format}</dd></div>
        </dl>
        <a className="button button-dark" href={previewHref(inquiryHref(offer.id))}>Solicitar información <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      <a className="ai-service-feature" href={previewHref(href)}>
        <ArtImage art={art} />
        <div><Icon size={29} aria-hidden="true" /><h3>{title}</h3><span>{label} <ArrowUpRight size={16} aria-hidden="true" /></span></div>
      </a>
    </section>,
  };
}
