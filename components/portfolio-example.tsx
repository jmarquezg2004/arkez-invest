import { BookOpen, ChartPie } from "lucide-react";
import { firstGuideLink } from "@/lib/navigation";

const allocation = [
  { label: "Acciones", weight: 45 },
  { label: "Bonos", weight: 35 },
  { label: "Liquidez", weight: 20 },
] as const;

export function PortfolioExample() {
  const equityEnd = allocation[0].weight;
  const bondEnd = equityEnd + allocation[1].weight;

  return (
    <div className="portfolio-example">
      <figure className="allocation-panel" aria-labelledby="allocation-title">
        <header className="allocation-header">
          <div>
            <p className="allocation-label">Ejemplo didáctico</p>
            <h2 id="allocation-title">Composición de una cartera</h2>
          </div>
          <span className="allocation-symbol"><ChartPie size={21} strokeWidth={1.6} aria-hidden="true" /></span>
        </header>

        <div className="allocation-body">
          <div
            className="allocation-chart"
            aria-hidden="true"
            style={{ backgroundImage: `conic-gradient(var(--equity) 0 ${equityEnd}%, var(--bonds) ${equityEnd}% ${bondEnd}%, var(--cash) ${bondEnd}% 100%)` }}
          />
          <dl className="allocation-legend">
            {allocation.map(({ label, weight }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{weight} %</dd>
              </div>
            ))}
          </dl>
        </div>

        <figcaption>Distribución hipotética con fines educativos.</figcaption>
      </figure>

      <a className="hero-guide" href={firstGuideLink.href}>
        <span className="hero-guide-icon"><BookOpen size={20} strokeWidth={1.75} aria-hidden="true" /></span>
        <span><span className="hero-guide-label">Guía de inicio</span><strong>{firstGuideLink.label}</strong></span>
      </a>
    </div>
  );
}
