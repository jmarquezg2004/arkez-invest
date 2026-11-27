import { WeinsteinChart } from "./weinstein-chart";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { StaticImageData } from "next/image";
import { indicatorArt } from "./topic-art";

const stories = [
  { id: "volumen", title: "Volumen", lines: [
    "El volumen cuenta cuántas unidades se negociaron durante un periodo. Cada operación tiene un comprador y un vendedor.",
    "En una sesión ficticia se negociaron 80.000 acciones y en otra 20.000. En la primera hubo cuatro veces más volumen.",
    "El volumen por sí solo no indica la dirección del próximo cambio. Compara sesiones equivalentes y revisa si hubo una noticia o un evento.",
    "Si una sesión cerró antes de lo habitual, ¿qué otras sesiones te servirían para comparar su volumen?",
  ] },
  { id: "liquidez", title: "Liquidez", source: "https://www.investor.gov/introduction-investing/investing-basics/glossary/liquidity-or-marketability", lines: [
    "En un mercado líquido suele ser más fácil negociar con rapidez y sin mover mucho el precio.",
    "En dos ejemplos con la misma última cotización, uno muestra ofertas de USD 99,90 y USD 100,10, y el otro USD 98 y USD 102. El primer diferencial es USD 0,20 y el segundo USD 4.",
    "El diferencial es una pista. También importa cuántas unidades hay disponibles a esos precios y cómo cambia el mercado a lo largo del día.",
    "Si al mejor precio hay pocas unidades, ¿qué pasaría con el precio promedio de una operación más grande?",
  ] },
  { id: "precio", title: "Precio", lines: [
    "El último precio es el importe por unidad al que se cerró la operación más reciente en ese mercado.",
    "Una acción ficticia pasa de USD 40 a USD 44. Su precio subió un 10 %. Otra cuesta USD 5, pero eso no permite afirmar que su negocio valga menos.",
    "Comprueba moneda, hora y mercado. Para comparar empresas, considera el número de acciones y los datos del negocio.",
    "Dos empresas tienen el mismo precio por acción. ¿Qué dato necesitas para comparar el valor total de sus acciones?",
  ] },
  { id: "sma", title: "SMA · Media móvil simple", lines: [
    "La SMA promedia los últimos cierres de una ventana. Cada cierre tiene el mismo peso.",
    "Con tres cierres de USD 10, 12 y 14, la SMA de tres periodos es USD 12. Si el siguiente cierre es 16, sale el 10 y el promedio pasa a USD 14.",
    "Confirma si los periodos son días o semanas. Una media resume precios pasados y reacciona con retraso.",
    "Si los cierres de la ventana son 12, 14 y 16, ¿cuál sale del cálculo al incorporar un nuevo cierre de 18?",
  ] },
  { id: "per", title: "PER · Precio sobre beneficio", source: "https://www.investor.gov/introduction-investing/investing-basics/glossary/price-earnings-pe-ratio", lines: [
    "Isa pone una etiqueta de precio junto al informe de una empresa. El PER compara lo que cuesta una acción con el beneficio que le corresponde.",
    "La acción ficticia cuesta USD 60 y el beneficio anual por acción es USD 3. Con la calculadora obtiene un PER de 20 veces.",
    "Antes de comparar una fábrica con una tienda, Isa mira si ambos beneficios corresponden al mismo periodo y si son históricos o estimados.",
    "Llega un informe con un beneficio menor. Si cae a USD 2 por acción y el precio sigue en USD 60, ¿qué PER resulta?",
  ] },
  { id: "roic", title: "ROIC · Retorno sobre el capital invertido", lines: [
    "Mientras riega sus plantas, Isa se pregunta cuánto produjo el vivero con los recursos que necesitó para operar.",
    "El vivero ficticio obtiene USD 12 de beneficio operativo después de impuestos sobre USD 100 de capital invertido promedio. El ROIC del ejemplo es 12 %.",
    "Al comparar el vivero con otro negocio, Isa comprueba si ambos cálculos incluyen las mismas partidas, como arrendamientos o adquisiciones.",
    "El vivero se amplía. Si ahora usa USD 150 de capital y el beneficio sigue en USD 12, ¿cómo cambia su retorno?",
  ] },
  { id: "peg", title: "PEG · PER frente al crecimiento", lines: [
    "Isa tiene una etiqueta con el PER y un gráfico de beneficios estimados. El PEG compara el PER con el crecimiento esperado del beneficio por acción.",
    "Al leer las proyecciones, encuentra un crecimiento anual del 10 %. Con un PER de 20, anota 20 ÷ 10 = 2.",
    "Comprueba de dónde sale la previsión y qué años abarca. Con crecimiento de cero, la división queda indefinida.",
    "Isa dibuja una trayectoria más lenta. Si el PER se mantiene en 20 y la previsión baja al 5 %, ¿cuál sería el nuevo PEG?",
  ] },
] as const;

const stages = [
  { name: "1 · Base", text: "Tras una caída, el precio se mueve en un rango y la media de 30 semanas pierde pendiente." },
  { name: "2 · Avance", text: "El precio sale del rango y el promedio comienza a subir. El patrón describe lo observado hasta ese momento." },
  { name: "3 · Techo", text: "Después del avance, el precio vuelve a un rango. La media ascendente empieza a aplanarse." },
  { name: "4 · Descenso", text: "El precio pierde el rango y la media se inclina hacia abajo. La clasificación puede cambiar con nuevas observaciones." },
];

function StoryArt({ frame, label, image }: { frame: number; label: string; image: StaticImageData }) {
  return <div className="avs-art" data-art-frame={frame}>
    <img src={image.src} width={image.width} height={image.height} alt="" loading="lazy" decoding="async" />
    <span className="avs-dialogue">{label}</span>
  </div>;
}

export function MarketStories() {
  return <section id="historias-mercado" className="avs-market-stories" aria-labelledby="market-stories-title">
    <h2 id="market-stories-title">Indicadores y etapas del mercado</h2>
    <nav className="avs-topic-links" aria-label="Historias de lectura de mercado">
      {stories.map(({ id, title }) => <a key={id} href={`#indicador-${id}`}>{title} <ArrowRight size={16} aria-hidden="true" /></a>)}
      <a href="#etapas-weinstein">Etapas 1–4 de Stan Weinstein <ArrowRight size={16} aria-hidden="true" /></a>
    </nav>
    {stories.map((story) => <figure key={story.id} className="avs avs-indicator" data-panels="4" id={`indicador-${story.id}`} aria-labelledby={`titulo-${story.id}`}>
      <header><div><p className="avs-series">Arkez Visual Stories</p><h3 id={`titulo-${story.id}`}>{story.title}</h3></div></header>
      <ol className="avs-panels" aria-label="Cuatro viñetas">
        {story.lines.map((line, index) => <li key={line} data-panel={index + 1}>
          <StoryArt image={indicatorArt[story.id]} frame={index + 1} label={["Qué mide", "Ejemplo", "Cómo leerlo", "Ponlo a prueba"][index]} />
          <p>{line}</p>
        </li>)}
      </ol>
      {"source" in story && <figcaption><a className="avs-reading-link" href={story.source} target="_blank" rel="noopener noreferrer">Definición de Investor.gov <ArrowUpRight size={16} aria-hidden="true" /></a></figcaption>}
    </figure>)}
    <figure className="avs avs-indicator" id="etapas-weinstein" data-panels="4" aria-labelledby="titulo-weinstein">
      <header><div><p className="avs-series">Arkez Visual Stories</p><h3 id="titulo-weinstein">Las cuatro etapas de Stan Weinstein</h3></div></header>
      <WeinsteinChart />
      <ol className="avs-panels" aria-label="Cuatro etapas">
        {stages.map(({ name, text }, index) => <li key={name} data-panel={index + 1}>
          <StoryArt image={indicatorArt.weinstein} frame={index + 1} label={name} /><p>{text}</p>
        </li>)}
      </ol>
      <figcaption>Esquema ficticio basado en el análisis semanal descrito por Stan Weinstein en <cite>Secrets for Profiting in Bull and Bear Markets</cite> (1988). Las etapas describen patrones y pueden ser ambiguas. No pronostican lo que ocurrirá.</figcaption>
    </figure>
  </section>;
}
