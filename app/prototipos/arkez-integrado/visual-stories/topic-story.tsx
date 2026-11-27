import { beginnerTopics, type BeginnerTopic } from "../learning-path";
import { topicArt } from "./topic-art";

export function TopicStory({ topic }: { topic: BeginnerTopic }) {
  const { label, panels } = beginnerTopics[topic];
  const image = topicArt[topic];
  return <figure className="avs" data-panels="4" id={`historia-tema-${topic}`} aria-labelledby={`tema-${topic}-titulo`}>
    <header><div><p className="avs-series">Arkez Visual Stories</p><h3 id={`tema-${topic}-titulo`}>{label}</h3></div></header>
    <ol className="avs-panels" aria-label="Historieta en cuatro viñetas">
      {panels.map((caption, index) => <li key={caption} data-panel={index + 1}>
        <div className="avs-art"><img src={image.src} width={image.width} height={image.height} alt="" loading="lazy" decoding="async" />
          <span className="avs-panel-number" aria-hidden="true">{index + 1}</span>
        </div>
        <p>{caption}</p>
      </li>)}
    </ol>
  </figure>;
}
