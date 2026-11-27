"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Play } from "lucide-react";
import { stories, storyAnchor, type StoryKey } from "./stories";

const motionPreference = "(prefers-reduced-motion: reduce)";

export function StoryStrip({ story, heading }: { story: StoryKey; heading?: "h2" | "h3" }) {
  const { title, panels, image, takeaway } = stories[story];
  const Heading = heading ?? stories[story].heading;
  const titleId = useId();
  const strip = useRef<HTMLOListElement>(null);
  const animations = useRef<Animation[]>([]);
  const [canPlay, setCanPlay] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(motionPreference);
    const update = () => {
      setCanPlay(!media.matches);
      if (media.matches) animations.current.forEach((animation) => animation.cancel());
    };
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      animations.current.forEach((animation) => animation.cancel());
    };
  }, []);

  function play() {
    if (window.matchMedia(motionPreference).matches || !strip.current) return;
    animations.current.forEach((animation) => animation.cancel());
    animations.current = Array.from(strip.current.children).flatMap((panel, index) => {
      const timing = { duration: 760, delay: index * 660, easing: "ease-in-out" };
      const image = panel.querySelector(".avs-art img");
      const dialogue = panel.querySelector(".avs-dialogue");
      return [
        image?.animate([{ scale: 1 }, { scale: 1.065, offset: .48 }, { scale: 1 }], timing),
        dialogue?.animate([{ translate: "0 0" }, { translate: "0 -5px", scale: 1.025, offset: .48 }, { translate: "0 0" }], timing),
      ].filter((animation): animation is Animation => Boolean(animation));
    });
  }

  return <figure id={storyAnchor(story)} className="avs" data-panels={panels.length} data-visual-story={story} aria-labelledby={titleId}>
    <header>
      <div><p className="avs-series">Arkez Visual Stories</p><Heading id={titleId}>{title}</Heading></div>
      <div className="avs-controls">
        {canPlay && <button type="button" onClick={play}><Play size={16} aria-hidden="true" /> Animar viñetas</button>}
      </div>
    </header>
    <ol className="avs-panels" ref={strip} aria-label={`Historieta en ${panels.length} viñetas`}>
      {panels.map(({ alt, caption, dialogue }, index) => <li key={caption} data-panel={index + 1}>
        <div className="avs-art"><img src={image.src} width={image.width} height={image.height} alt={alt} loading="lazy" decoding="async" /><span className="avs-dialogue">{dialogue}</span><span className="avs-panel-number" aria-hidden="true">{index + 1}</span></div>
        <p>{caption}</p>
      </li>)}
    </ol>
    <figcaption>{takeaway}</figcaption>
  </figure>;
}
