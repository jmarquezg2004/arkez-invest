import { ArrowRight, MoveUpRight } from "lucide-react";
import { innovationPath, innovationTopics } from "@/lib/innovation";
import { TopicDiagram } from "./hub-visuals";

export function TopicExplorer() {
  return (
    <fieldset className="hub-explorer">
      <legend className="sr-only">Selecciona una tecnología financiera</legend>
      <div className="hub-options">
        {innovationTopics.map((topic, index) => (
          <div className="hub-option" key={topic.id}>
            <input className="sr-only" type="radio" name="tema-innovacion" id={`hub-select-${topic.id}`} defaultChecked={index === 0} />
            <label htmlFor={`hub-select-${topic.id}`}><span>{topic.title}</span><ArrowRight size={17} aria-hidden="true" /></label>
          </div>
        ))}
      </div>
      <div className="hub-panels">
        {innovationTopics.map((topic) => (
          <div className="hub-panel" data-topic={topic.id} key={topic.id}>
            <p className="eyebrow">{topic.short}</p>
            <h4>{topic.title}</h4>
            <p>{topic.summary}</p>
            <TopicDiagram topic={topic} />
            <div className="hub-panel-links">
              <a href={`${innovationPath}#${topic.id}`}>Profundizar en el tema<ArrowRight size={16} aria-hidden="true" /></a>
              <a href={topic.resource.href}>{topic.resource.label}<MoveUpRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
