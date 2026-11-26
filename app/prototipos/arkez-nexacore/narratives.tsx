"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, BookOpen, Building2, ChartPie, CircleCheck, FileText, Layers2, Play, RotateCcw, Search, Wallet } from "lucide-react";
import { ProductScene } from "./product-scenes";

function useSequence(last: number) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduced = useReducedMotion();
  useEffect(() => () => clearTimeout(timer.current), []);
  function select(index: number) { clearTimeout(timer.current); setPlaying(false); setActive(index); }
  function play() {
    select(0);
    if (reduced) { setActive(last); return; }
    setPlaying(true);
    function advance(index: number) {
      timer.current = setTimeout(() => {
        setActive(index);
        if (index < last) advance(index + 1);
        else setPlaying(false);
      }, 1160);
    }
    advance(1);
  }
  return { active, playing, select, play, reduced };
}

const sources = [
  { type: "Ahorros", detail: "Cuenta de ahorros · disponible", money: "4,2 mil", Icon: Wallet },
  { type: "Inversiones", detail: "Portafolio · saldo registrado", money: "6,8 mil", Icon: ChartPie },
  { type: "Gastos", detail: "Registro mensual · salidas", money: "1,2 mil", Icon: FileText },
];

export function Comparison() {
  const { active, playing, select, play } = useSequence(2);
  const [repair, setRepair] = useState(false);
  const coverage = repair ? "2,0" : "3,5";
  return <section className="nx-compare nx-pad" aria-labelledby="nx-compare-title">
    <div className="nx-wrap nx-compare-layout">
      <header className="nx-heading">
        <p className="nx-kicker">Antes y después</p><h2 id="nx-compare-title">De datos dispersos a una lectura clara.</h2>
        <p>Separa lo que tienes disponible de lo que ya está invertido. Luego compáralo con tu gasto mensual.</p>
        <div className="nx-switch nx-switch-compare" role="group" aria-label="Organización de la información">
          <button type="button" aria-pressed={active === 0} onClick={() => select(0)}>Dispersa</button>
          <button type="button" aria-pressed={active === 2} onClick={() => select(2)}>Organizada</button>
        </div>
        <div className="nx-narrative-controls">
          <button type="button" onClick={play}><Play size={16} />{playing ? "Volver a reproducir" : "Reproducir transformación"}</button>
          <button type="button" onClick={() => select(0)}><RotateCcw size={16} />Reiniciar</button>
        </div>
      </header>
      <MotionConfig reducedMotion="user"><LayoutGroup id="nx-comparison-v2">
        <div className="nx-consolidation" data-stage={active}>
          <div className="nx-consolidation-top"><span><Layers2 size={18} />{["Fuentes separadas", "Conciliando por tipo", "Lectura consolidada"][active]}</span><small>Ejemplo ficticio · USD</small></div>
          <div className="nx-consolidation-body">
            <div className="nx-origin-list">{sources.map(({ type, detail, money, Icon }) => <motion.div layout="position" className="nx-origin-row" key={type}><span className="nx-origin-icon"><Icon size={20} /></span><div><strong>{type}</strong><small>{detail}</small></div><b>{money}</b></motion.div>)}</div>
            {active > 0 && <motion.div layout="position" className="nx-consolidated" initial={false}>
              <p>Capital total</p><strong>11,0 mil USD</strong>
              <div className="nx-consolidated-meter" aria-hidden="true"><span /><span /></div>
              <dl><div><dt>Ahorro disponible</dt><dd>4,2 mil</dd></div><div><dt>Capital invertido</dt><dd>6,8 mil</dd></div><div><dt>Gasto mensual</dt><dd>1,2 mil</dd></div></dl>
            </motion.div>}
          </div>
          {active === 2 && <label className="nx-comparison-scenario">
            <input type="checkbox" checked={repair} onChange={(event) => setRepair(event.currentTarget.checked)} />
            Restar un gasto imprevisto de USD 1,8 mil
          </label>}
          <div className="nx-reading" aria-live="polite">
            {active === 2 ? <><CircleCheck size={23} /><div><strong>El ahorro cubre {coverage} meses al gasto actual.</strong><small>{repair ? "Quedan USD 2,4 mil después del imprevisto. " : ""}{repair ? "2,4 mil" : "4,2 mil"} disponibles ÷ 1,2 mil al mes. El capital invertido queda fuera de ese cálculo.</small></div></>
              : <span>{active === 1 ? "El gasto mensual queda separado del capital." : "Aún no hay una lectura conjunta. Cada fuente aporta un dato distinto."}</span>}
          </div>
        </div>
      </LayoutGroup></MotionConfig>
    </div>
  </section>;
}

const stages = [
  { title: "Comprende", detail: "Distingue los aportes del crecimiento estimado.", Icon: BookOpen },
  { title: "Explora", detail: "Revisa la información que sostiene cada supuesto.", Icon: Search },
  { title: "Simula", detail: "Cambia la valorización y contrasta el resultado.", Icon: Building2 },
  { title: "Aplica", detail: "Define qué dato comprobar antes de decidir.", Icon: CircleCheck },
] as const;

export function LearningStages() {
  const { active, playing, select, play, reduced } = useSequence(stages.length - 1);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <section className="nx-method nx-pad" id="nx-metodo" aria-labelledby="nx-method-title">
    <div className="nx-wrap">
      <header className="nx-heading"><p className="nx-kicker">Método Arkez</p><h2 id="nx-method-title">Cuatro pasos para aplicar lo aprendido.</h2></header>
      <div className="nx-method-layout">
        <div className="nx-method-actions">
          <ol>{stages.map(({ title, detail, Icon }, index) => <li key={title}>
            <button type="button" aria-pressed={index === active} onClick={() => select(index)}><span>0{index + 1}</span><Icon size={21} /><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight size={17} /></button>
          </li>)}</ol>
          <div className="nx-narrative-controls"><button type="button" className="nx-replay" onClick={play}><Play size={16} />{playing ? "Reiniciar secuencia" : "Reproducir secuencia"}</button></div>
        </div>
        <div className="nx-method-display" data-method-step={active}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} initial={!mounted || reduced ? false : { x: 30, opacity: 0 }} animate={mounted && !reduced ? { x: 0, opacity: 1 } : undefined} exit={mounted && !reduced ? { x: -24, opacity: 0 } : undefined} transition={{ duration: reduced ? 0 : .23 }}>
              {active === 0 ? <ProductScene variant={0} />
                : active === 1 ? <div className="nx-evidence"><FileText size={27} /><h3>Contrasta tus supuestos.</h3><dl><div><dt>Inflación</dt><dd>Consulta el índice de precios.</dd></div><div><dt>Ingresos</dt><dd>Revisa comparables de arriendo.</dd></div><div><dt>Gastos</dt><dd>Separa costos fijos y eventuales.</dd></div></dl><a href="https://www.dane.gov.co/index.php/estadisticas-por-tema/precios-y-costos/indice-de-precios-al-consumidor-ipc">Consultar IPC en el DANE <ArrowUpRight size={15} /></a></div>
                : active === 2 ? <ProductScene variant={1} expanded />
                : <div className="nx-evidence"><CircleCheck size={27} /><h3>Criterio de decisión</h3><p>Antes de decidir, contrasta el flujo real con un escenario sin valorización.</p><a href="#nx-lab-0">Probar en el evaluador <ArrowUpRight size={15} /></a></div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  </section>;
}
