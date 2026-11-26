import { ArrowUpRight } from "lucide-react";
import { base } from "../routes";
import { StoryStrip } from "./story-strip";

const report = base + "/research/oddity/";
const filing = "https://www.sec.gov/Archives/edgar/data/1907085/000110465926029490/odd-20251231x20f.htm";

export function OddityVisualStory() {
  return <main className="avs-company">
    <div className="container-shell">
      <nav aria-label="Ruta de navegación"><a href={base + "/explore/"}>Explorar empresas</a></nav>
      <h1>ODDITY en cuatro viñetas</h1>
      <p>Una compra de maquillaje sirve para entender cómo funciona una marca que vende directamente por internet.</p>
      <StoryStrip story="oddity" />
      <section className="avs-outlook" aria-labelledby="oddity-outlook">
        <h2 id="oddity-outlook">Dos escenarios a 3–5 años</h2>
        <p>Son escenarios educativos planteados por Arkez para explorar cómo podría cambiar el negocio.</p>
        <ul role="list">
          <li><h3>Más clientes vuelven a comprar</h3><p>Si aumenta la recompra y el costo de atender los pedidos se mantiene contenido, los ingresos podrían crecer con menor dependencia de conseguir clientes nuevos.</p>
            <p><strong>Qué comprobar.</strong> Si la empresa publica datos comparables de recompra, revisa su evolución junto a los gastos de venta.</p></li>
          <li><h3>Conseguir nuevos clientes cuesta más</h3><p>Si conseguir la primera compra se encarece y la recompra no mejora, el crecimiento podría traducirse en menos beneficio por cada unidad de ingreso.</p>
            <p><strong>Qué comprobar.</strong> Si los gastos de venta y administración crecen más rápido que los ingresos y qué factores señala la empresa.</p></li>
        </ul>
        <div className="avs-company-links">
          <a href={report + "modelo/"}>Ver el modelo de negocio en Research <ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href={report + "informe/"}>Consultar resultados y márgenes <ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href={filing}>Leer el informe anual 2025 en la SEC <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </section>
    </div>
  </main>;
}
