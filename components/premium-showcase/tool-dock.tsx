import { ArrowRight } from "@/components/arkez-icons";
import { calculateCompound, compoundExample } from "@/lib/compound-interest";
import { comparePortfolios } from "@/lib/innovation-scenario";
import { FrameLabel, decimal, money } from "./visuals";

export function PremiumToolDock() {
  const projection = calculateCompound(compoundExample);
  const comparison = comparePortfolios(15, 25);

  return <div className="px-tool-grid">
    <article className="px-tool-card">
      <FrameLabel title="Simulación de ahorro" badge="Ejemplo · 10 años" />
      <div className="px-tool-body">
        <h3>Capital estimado</h3>
        <strong>{money.format(projection.final.balance)}</strong>
        <div className="px-tool-bars" aria-hidden="true">
          {projection.rows.filter(({year}) => year > 0).map(({year, balance}) => <meter key={year} min={0} max={projection.final.balance} value={balance} />)}
        </div>
        <a href="#proyeccion">Ajustar mis aportes<ArrowRight size={17} /></a>
      </div>
    </article>
    <article className="px-tool-card">
      <FrameLabel title="Escenario de cartera" badge="Ejemplo · alza digital" />
      <div className="px-tool-body">
        <h3>Mismo supuesto, dos pesos</h3>
        <dl className="px-tool-compare">
          <div><dt>Referencia</dt><dd>{decimal.format(comparison.referenceChange)} %</dd></div>
          <div><dt>Combinada</dt><dd>{decimal.format(comparison.diversifiedChange)} %</dd></div>
        </dl>
        <a href="#dashboard">Cambiar el escenario<ArrowRight size={17} /></a>
      </div>
    </article>
  </div>;
}
