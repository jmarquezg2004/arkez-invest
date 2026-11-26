import { ArrowUpRight, BookOpen, ChartNoAxesCombined, Compass, Network } from "lucide-react";
import { aiMapPath, base, learningPathRoute } from "./routes";

export function ResearchWelcome() {
  return <section className="ai-research-welcome container-shell" aria-labelledby="research-welcome-title">
    <header><p className="eyebrow">Aprendizaje financiero</p>
      <h2 id="research-welcome-title">Entiende un negocio antes de interpretar su gráfico</h2>
      <p>Empieza con dos recursos gratuitos. Elige un punto de partida según lo que ya conoces.</p>
    </header>
    <div className="ai-learning-picks">
      <article><Compass aria-hidden="true" /><h3>Si estás empezando</h3>
        <p>Encuentra una guía y un ejercicio para aprender a tu ritmo.</p>
        <a className="nx-button nx-button-learning" href={base + learningPathRoute}>Encontrar mi ruta gratuita <ArrowUpRight size={17} aria-hidden="true" /></a>
      </article>
      <article><ChartNoAxesCombined aria-hidden="true" /><h3>Si ya manejas lo básico</h3>
        <p>Consulta una empresa y aprende qué vende, quién paga y qué cifras vale la pena contrastar.</p>
        <a className="nx-button nx-button-learning" href={base + "/research/#consultar-ticker"}>Hacer una consulta gratuita <ArrowUpRight size={17} aria-hidden="true" /></a>
      </article>
    </div>
    <p className="ai-learning-follow"><a href={base + "/research/#taller-research"}>Practicar con un caso</a> · <a href={base + "/research/#planes-research"}>Ver planes y consultoría educativa</a></p>
  </section>;
}

export function ResearchWorkshop() {
  return <section className="ai-research-pricing ai-research-workshop" id="taller-research" aria-labelledby="research-workshop-title">
    <header><p className="ve-kicker">Práctica guiada</p><h2 id="research-workshop-title">Cómo investigar antes de sacar conclusiones</h2>
      <p>Contrasta fuentes, prueba tus hipótesis y guarda tus observaciones. Los ejercicios sirven para aprender y no constituyen asesoría de inversión.</p>
    </header>
    <div className="ai-learning-picks">
      <article><Network aria-hidden="true" /><h3>Relaciones y movimientos internos</h3>
        <p>Distingue un proveedor de un cliente y una compra de acciones de una concesión. Revisa el código y las notas del formulario antes de atribuirle una intención.</p>
        <a href={aiMapPath}>Explorar la red de IA</a>
        <a href="https://www.sec.gov/forms/forms-3-4-5.pdf" target="_blank" rel="noopener noreferrer">Leer la guía de la SEC sobre operaciones de insiders <ArrowUpRight size={16} aria-hidden="true" /></a>
      </article>
      <article><BookOpen aria-hidden="true" /><h3>Estrategias y escenarios</h3>
        <p>Compara inversión en valor e indexación con la misma pregunta: ¿qué tendría que ocurrir para que la hipótesis falle?</p>
        <details><summary>Probar un ejemplo</summary>
          <p>En un caso ficticio, una empresa gana USD 10 y cotiza a USD 100 por acción. Si el beneficio baja a USD 5, la relación precio/beneficio pasa de 10 a 20. Un múltiplo bajo depende de si el beneficio es sostenible. En una cartera indexada, compara cuánto pesaría esa empresa dentro del conjunto.</p>
        </details>
        <a href={base + "/recursos/guias/#comparar-escenarios"}>Practicar con dos escenarios</a>
      </article>
      <article><ChartNoAxesCombined aria-hidden="true" /><h3>Lecturas y tablero de práctica</h3>
        <p>Cambia el mes y la plataforma para reconocer concentraciones en un registro simulado. Usa el artículo para documentar fuentes y periodos.</p>
        <a href={base + "/#nx-lab-2"}>Abrir el tablero de ejemplo</a>
        <a href={base + "/recursos/articulos/#lectura-de-mercados"}>Leer sobre análisis de mercados</a>
      </article>
    </div>
  </section>;
}
