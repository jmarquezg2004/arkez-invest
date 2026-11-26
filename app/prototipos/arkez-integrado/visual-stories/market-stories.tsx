import { ArrowRight, ArrowUpRight } from "lucide-react";
import analyst from "./lectura-indicadores.webp";

const stories = [
  { id: "volumen", title: "Volumen", lines: [
    "El volumen cuenta cuántas unidades se negociaron durante un periodo. Cada operación tiene un comprador y un vendedor.",
    "En una sesión ficticia se negociaron 80.000 acciones y en otra 20.000. En la primera hubo cuatro veces más volumen.",
    "El volumen por sí solo no indica la dirección del próximo cambio. Compara sesiones equivalentes y revisa si hubo una noticia o un evento.",
  ] },
  { id: "liquidez", title: "Liquidez", source: "https://www.investor.gov/introduction-investing/investing-basics/glossary/liquidity-or-marketability", lines: [
    "En un mercado líquido suele ser más fácil negociar con rapidez y sin mover mucho el precio.",
    "En dos ejemplos con la misma última cotización, uno muestra ofertas de USD 99,90 y USD 100,10, y el otro USD 98 y USD 102. El primer diferencial es USD 0,20 y el segundo USD 4.",
    "El diferencial es una pista. También importa cuántas unidades hay disponibles a esos precios y cómo cambia el mercado a lo largo del día.",
  ] },
  { id: "precio", title: "Precio", lines: [
    "El último precio es el importe por unidad al que se cerró la operación más reciente en ese mercado.",
    "Una acción ficticia pasa de USD 40 a USD 44. Su precio subió un 10 %. Otra cuesta USD 5, pero eso no permite afirmar que su negocio valga menos.",
    "Comprueba moneda, hora y mercado. Para comparar empresas, considera el número de acciones y los datos del negocio.",
  ] },
  { id: "sma", title: "SMA · Media móvil simple", lines: [
    "La SMA promedia los últimos cierres de una ventana. Cada cierre tiene el mismo peso.",
    "Con tres cierres de USD 10, 12 y 14, la SMA de tres periodos es USD 12. Si el siguiente cierre es 16, sale el 10 y el promedio pasa a USD 14.",
    "Confirma si los periodos son días o semanas. Una media resume precios pasados y reacciona con retraso.",
  ] },
  { id: "per", title: "PER · Precio sobre beneficio", source: "https://www.investor.gov/introduction-investing/investing-basics/glossary/price-earnings-pe-ratio", lines: [
    "El PER divide el precio por acción entre el beneficio por acción. Se expresa en veces.",
    "Precio ficticio de USD 60 y beneficio anual por acción de USD 3. El PER es 20 veces.",
    "Aclara si el beneficio es histórico o estimado. Si es negativo, el PER deja de tener su interpretación habitual.",
  ] },
  { id: "roic", title: "ROIC · Retorno sobre el capital invertido", lines: [
    "El ROIC relaciona el beneficio operativo después de impuestos con el capital invertido en el negocio. Los ajustes pueden variar por fuente.",
    "Una empresa ficticia obtiene USD 12 de beneficio operativo después de impuestos sobre USD 100 de capital invertido promedio. El ROIC del ejemplo es 12 %.",
    "Compara el mismo periodo y el mismo método. Revisa si las adquisiciones, el efectivo o los arrendamientos cambian el capital calculado.",
  ] },
  { id: "peg", title: "PEG · PER frente al crecimiento", lines: [
    "El PEG divide el PER entre la tasa de crecimiento del beneficio por acción expresada en puntos porcentuales.",
    "Con PER de 20 y crecimiento esperado de 10 % anual, el PEG ilustrativo es 20 ÷ 10 = 2.",
    "Anota de dónde sale la estimación y su horizonte. El cálculo pierde sentido con crecimiento cero o negativo y puede cambiar mucho si cambia la previsión.",
  ] },
] as const;

const stages = [
  { name: "1 · Base", text: "Tras una caída, el precio se mueve en un rango y la media de 30 semanas pierde pendiente." },
  { name: "2 · Avance", text: "El precio sale del rango y el promedio comienza a subir. El patrón describe lo observado hasta ese momento." },
  { name: "3 · Techo", text: "Después del avance, el precio vuelve a un rango. La media ascendente empieza a aplanarse." },
  { name: "4 · Descenso", text: "El precio pierde el rango y la media se inclina hacia abajo. La clasificación puede cambiar con nuevas observaciones." },
];

function StoryArt({ frame, label }: { frame: number; label: string }) {
  return <div className="avs-art" data-art-frame={frame}>
    <img src={analyst.src} width={analyst.width} height={analyst.height} alt="" loading="lazy" decoding="async" />
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
    {stories.map((story, storyIndex) => <figure key={story.id} className="avs avs-indicator" id={`indicador-${story.id}`} aria-labelledby={`titulo-${story.id}`}>
      <header><div><p className="avs-series">Arkez Visual Stories</p><h3 id={`titulo-${story.id}`}>{story.title}</h3></div></header>
      <ol className="avs-panels" aria-label="Tres viñetas">
        {story.lines.map((line, index) => <li key={line} data-panel={index + 1}>
          <StoryArt frame={(storyIndex + index) % 4 + 1} label={["Qué mide", "Ejemplo", "Cómo leerlo"][index]} />
          <p>{line}</p>
        </li>)}
      </ol>
      {"source" in story && <figcaption><a className="avs-reading-link" href={story.source} target="_blank" rel="noopener noreferrer">Definición de Investor.gov <ArrowUpRight size={16} aria-hidden="true" /></a></figcaption>}
    </figure>)}
    <figure className="avs avs-indicator" id="etapas-weinstein" data-panels="4" aria-labelledby="titulo-weinstein">
      <header><div><p className="avs-series">Arkez Visual Stories</p><h3 id="titulo-weinstein">Las cuatro etapas de Stan Weinstein</h3></div></header>
      <svg className="avs-stage-chart" viewBox="0 0 400 130" role="img" aria-label="Esquema ficticio. Precio y media de 30 semanas recorren base, avance, techo y descenso.">
        <rect width="400" height="130" fill="#edf3f7" />
        {[100, 200, 300].map((x) => <path key={x} d={`M${x} 12V110`} stroke="#8195aa" strokeDasharray="3 4" />)}
        <path d="M10 77L28 90L48 81L64 92L89 84L108 75L125 60L140 66L160 42L185 29L204 32L228 21L248 35L270 28L290 36L309 52L331 56L346 77L364 81L389 105" fill="none" stroke="#183c60" strokeWidth="3" />
        <path d="M10 70Q60 92 100 84Q150 76 200 42Q246 27 298 39Q344 49 389 90" fill="none" stroke="#8f551d" strokeWidth="2.5" strokeDasharray="6 4" />
        {[50, 150, 250, 350].map((x, i) => <text key={x} x={x} y="124" textAnchor="middle" fill="#183c60" fontSize="11">{i + 1}</text>)}
      </svg>
      <p className="avs-chart-key"><span>Precio semanal</span><span>Media de 30 semanas</span></p>
      <ol className="avs-panels" aria-label="Cuatro etapas">
        {stages.map(({ name, text }, index) => <li key={name} data-panel={index + 1}>
          <StoryArt frame={index + 1} label={name} /><p>{text}</p>
        </li>)}
      </ol>
      <figcaption>Esquema ficticio basado en el análisis semanal descrito por Stan Weinstein en <cite>Secrets for Profiting in Bull and Bear Markets</cite> (1988). Las etapas describen patrones y pueden ser ambiguas. No pronostican lo que ocurrirá.</figcaption>
    </figure>
  </section>;
}
