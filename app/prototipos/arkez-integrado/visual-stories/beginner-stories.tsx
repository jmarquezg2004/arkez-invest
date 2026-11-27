import { ArrowRight } from "lucide-react";
import { beginnerKeys, beginnerTopics } from "../learning-path";
import { TopicStory } from "./topic-story";

export function BeginnerStories() {
  return <section aria-labelledby="beginner-stories-title">
    <h2 id="beginner-stories-title">Conceptos financieros en cuatro viñetas</h2>
    <nav className="avs-topic-links" aria-label="Historias para empezar">
      {beginnerKeys.map((key) => <a key={key} href={`#historia-tema-${key}`}>{beginnerTopics[key].label} <ArrowRight size={16} aria-hidden="true" /></a>)}
    </nav>
    {beginnerKeys.map((key) => <TopicStory key={key} topic={key} />)}
  </section>;
}
