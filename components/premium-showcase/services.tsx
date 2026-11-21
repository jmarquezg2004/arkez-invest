import { ArrowRight, BusinessMark, EducationMark, MarketMark } from "@/components/arkez-icons";
import { offers } from "@/lib/commercial-offers";
import { FrameLabel } from "./visuals";

const actions = ["Explorar el curso", "Ver la formación", "Ver opciones para empresas"];
const marks = [EducationMark, MarketMark, BusinessMark];

function StudyStack() {
  return <div className="px-study-stack" aria-hidden="true">
    <div className="px-stack-sheet px-stack-back" />
    <div className="px-stack-sheet px-stack-mid" />
    <div className="px-stack-sheet px-stack-front">
      <small>Guía de decisión</small><strong>Antes de invertir</strong>
      <span>Objetivo</span><span>Costos</span><span>Riesgo</span>
    </div>
  </div>;
}

function MarketLens() {
  return <div className="px-market-lens" aria-hidden="true">
    <FrameLabel title="Lectura de señales" badge="Índice ficticio" />
    <svg viewBox="0 0 290 100">
      <path className="px-lens-grid" d="M12 20H278M12 50H278M12 80H278M45 10V90M120 10V90M195 10V90M268 10V90" />
      <path className="px-lens-candles" d="M23 70V48 M58 65V31 M93 74V52 M128 71V26 M163 55V24 M198 62V37 M233 47V15 M268 45V10" />
      <path className="px-lens-bars" d="M23 55V64 M58 39V58 M93 60V68 M128 37V56 M163 33V48 M198 45V53 M233 23V37 M268 18V31" />
    </svg>
    <div className="px-lens-tag">Contexto · Volumen · Fecha</div>
  </div>;
}

function CashFlow() {
  return <div className="px-cashflow" aria-hidden="true">
    <FrameLabel title="Una semana de caja" badge="Ejemplo" />
    <div className="px-cash-row"><span>Cobros</span><i /><strong>+3,2 M</strong></div>
    <div className="px-cash-row"><span>Pagos</span><i /><strong>−2,1 M</strong></div>
    <div className="px-cash-balance"><span>Saldo del periodo</span><strong>COP 1,1 M</strong></div>
  </div>;
}

const previews = [StudyStack, MarketLens, CashFlow];

export function PremiumServices() {
  return <ul className="px-services" role="list">
    {offers.slice(0,3).map(({title,summary,href},i) => {
      const Icon=marks[i];
      const Preview=previews[i];
      return <li className="px-service" data-style={i} key={href}>
        <div className="px-service-media"><Preview /></div>
        <div className="px-service-text">
          <span className="px-service-mark"><Icon size={22} /></span>
          <h3>{title}</h3><p>{summary}</p>
          <a href={href}>{actions[i]}<ArrowRight size={17} aria-hidden="true" /></a>
        </div>
      </li>;
    })}
  </ul>;
}
