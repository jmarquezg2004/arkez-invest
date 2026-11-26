import { ArrowRight } from "lucide-react";
import { beginnerKeys, beginnerTopics } from "../learning-path";
import { stories } from "./stories";

const artwork = {
  markets: stories.fuentes.image,
  payments: stories.pagos.image,
  business: stories.oddity.image,
  basket: stories.diversificacion.image,
  cash: stories.caja.image,
  time: stories.plazos.image,
};
const beats = ["El concepto", "El ejemplo", "Tu turno"];

export function BeginnerStories() {
  return <section aria-labelledby="beginner-stories-title">
    <h2 id="beginner-stories-title">Conceptos financieros en tres viñetas</h2>
    <nav className="avs-topic-links" aria-label="Historias para empezar">
      {beginnerKeys.map((key) => <a key={key} href={`#historia-tema-${key}`}>{beginnerTopics[key].label} <ArrowRight size={16} aria-hidden="true" /></a>)}
    </nav>
    {beginnerKeys.map((key) => {
      const { label, panels, art } = beginnerTopics[key];
      const image = artwork[art];
      return <figure key={key} className="avs" id={`historia-tema-${key}`} aria-labelledby={`tema-${key}-titulo`}>
        <header><div><p className="avs-series">Arkez Visual Stories</p><h3 id={`tema-${key}-titulo`}>{label}</h3></div></header>
        <ol className="avs-panels" aria-label="Historieta en tres viñetas">
          {panels.map((caption, index) => <li key={beats[index]} data-panel={index + 1}>
            <div className="avs-art"><img src={image.src} width={image.width} height={image.height} alt="" loading="lazy" decoding="async" />
              <span className="avs-dialogue">{beats[index]}</span><span className="avs-panel-number" aria-hidden="true">{index + 1}</span>
            </div>
            <p>{caption}</p>
          </li>)}
        </ol>
      </figure>;
    })}
  </section>;
}
