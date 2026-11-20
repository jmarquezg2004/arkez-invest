import { BookOpen } from "lucide-react";
import { firstGuideLink } from "@/lib/navigation";

export function CapabilitiesPanel() {
  return (
    <section className="capabilities-panel" aria-labelledby="capabilities-title">
      <h2 id="capabilities-title">Capacidades en práctica</h2>
      <ul className="capabilities-list" role="list">
        <li className="market-capability">
          <div>
            <h3>Análisis de mercados</h3>
            <p>Interpretación de tendencias e indicadores.</p>
          </div>
          <span className="market-graphic" aria-hidden="true">
            <span className="market-chart-lines" />
          </span>
        </li>
        <li>
          <div>
            <h3>Gestión del riesgo</h3>
            <p>Diversificación y evaluación de escenarios.</p>
          </div>
          <span className="capability-graphic risk-graphic" aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i /><i /><i />
          </span>
        </li>
        <li>
          <div>
            <h3>Tecnología aplicada</h3>
            <p>Herramientas digitales para analizar información financiera.</p>
          </div>
          <span className="capability-graphic technology-graphic" aria-hidden="true">
            <i /><i /><i />
          </span>
        </li>
      </ul>
      <p className="capabilities-note">Gráficos ilustrativos con fines educativos.</p>
      <a className="hero-guide" href={firstGuideLink.href}>
        <span className="hero-guide-icon"><BookOpen size={19} strokeWidth={1.75} aria-hidden="true" /></span>
        <span><span className="hero-guide-label">Guía de inicio</span><strong>{firstGuideLink.label}</strong></span>
      </a>
    </section>
  );
}
