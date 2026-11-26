import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ArtImage } from "@/arkez-visual-engine/components/art";
import { base, oddityStoryPath } from "../routes";
import { stories, storyAnchor, type StoryKey } from "./stories";
import { StoryStrip } from "./story-strip";

const entries = Object.keys(stories) as StoryKey[];
const reels = base + "/archivos/visual-stories/";

export function StoryLibrary() {
  return <main className="avs-library">
    <div className="ve">
      <header className="ve-explore-hero ai-library-hero">
        <ArtImage art="study" eager />
        <div><p className="ve-kicker">Arkez Research</p>
          <h1>Arkez Visual Stories</h1>
          <p>Historietas y reels para entender cómo funciona un negocio, leer una cifra o comparar escenarios.</p>
        </div>
      </header>
    </div>
    <div className="container-shell avs-library-body">
      <nav aria-labelledby="avs-library-topics">
        <h2 id="avs-library-topics">Explora por tema</h2>
        <ul className="avs-cards" role="list">{entries.map((key) => {
          const { image, topic, title } = stories[key];
          return <li key={key}><a href={key === "oddity" ? oddityStoryPath : "#" + storyAnchor(key)}>
            <img src={image.src} width={image.width} height={image.height} alt="" loading="lazy" decoding="async" />
            <span><small>{topic}</small><strong>{title}</strong></span>
            <ArrowRight size={20} aria-hidden="true" />
          </a></li>;
        })}</ul>
      </nav>
      <section aria-labelledby="avs-library-stories">
        <h2 id="avs-library-stories">Lee y anima las viñetas</h2>
        {entries.filter((key) => key !== "oddity").map((key) => <div key={key}>
          <StoryStrip story={key} heading="h3" reelDirectory={reels} />
          <a className="avs-reading-link" href={base + stories[key].route}>Ampliar el tema: {stories[key].topic} <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>)}
      </section>
    </div>
  </main>;
}
