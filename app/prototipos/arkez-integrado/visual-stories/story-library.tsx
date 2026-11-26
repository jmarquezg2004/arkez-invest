import { ArrowRight } from "lucide-react";
import { base, visualStoriesPath } from "../routes";
import { stories, storyAnchor, type StoryKey } from "./stories";

export function StoryCards({ items }: { items: readonly StoryKey[] }) {
  return <ul className="avs-cards" role="list">{items.map((key) => {
    const { image, route, topic, title } = stories[key];
    return <li key={key}><a href={base + route + "#" + storyAnchor(key)}>
      <img src={image.src} width={image.width} height={image.height} alt="" loading="lazy" decoding="async" />
      <span><small>{topic}</small><strong>{title}</strong></span>
      <ArrowRight size={20} aria-hidden="true" />
    </a></li>;
  })}</ul>;
}

export function StoryShelf({ items, id }: { items: readonly StoryKey[]; id: string }) {
  return <section className="avs-shelf" aria-labelledby={id}>
    <header><h2 id={id}>Arkez Visual Stories</h2><a href={visualStoriesPath}>Ver todas las historias <ArrowRight size={18} aria-hidden="true" /></a></header>
    <StoryCards items={items} />
  </section>;
}

export function StoryLibrary() {
  return <main className="avs-library">
    <div className="container-shell">
      <p className="eyebrow">Formación financiera</p>
      <h1>Arkez Visual Stories</h1>
      <p>Historietas de tres o cuatro viñetas para entender una idea y seguir leyendo en su guía, artículo o caso empresarial.</p>
      <StoryCards items={Object.keys(stories) as StoryKey[]} />
    </div>
  </main>;
}
