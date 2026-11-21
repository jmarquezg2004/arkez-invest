import { ArrowDown, ArrowRight } from "@/components/arkez-icons";
import travesia from "./travesia.webp";

export function EditorialIntro() {
  return <section className="ax-hero" aria-labelledby="ax-title">
    <div className="ax-hero-copy">
      <p className="ax-kicker">Arkez Invest · Educación financiera</p>
      <h1 id="ax-title">Antes de invertir, <em>entiende.</em></h1>
      <p>Compara decisiones sobre ahorro, inmuebles y tecnología con herramientas que puedes probar.</p>
      <div className="ax-hero-actions">
        <a className="ax-primary" href="#inmuebles">Probar el simulador<ArrowDown size={17} /></a>
        <a className="ax-secondary" href="#caminos-arkez">Explorar los tres caminos<ArrowRight size={17} /></a>
      </div>
    </div>
    <img className="ax-hero-art" src={travesia.src} width={travesia.width} height={travesia.height}
      alt="" fetchPriority="high" />
  </section>;
}
