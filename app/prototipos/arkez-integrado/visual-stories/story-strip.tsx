"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Play } from "lucide-react";
import { stories, storyAnchor, type StoryKey } from "./stories";

const motionPreference = "(prefers-reduced-motion: reduce)";

export function StoryStrip({ story, reelDirectory }: { story: StoryKey; reelDirectory?: string }) {
  const { title, panels, image, takeaway, heading: Heading } = stories[story];
  const titleId = useId();
  const strip = useRef<HTMLOListElement>(null);
  const animations = useRef<Animation[]>([]);
  const [canPlay, setCanPlay] = useState(false);
  const [showReel, setShowReel] = useState(false);
  const entry = stories[story];
  const reel = reelDirectory && "reel" in entry ? reelDirectory + entry.reel : undefined;
  const reelId = titleId + "-reel";

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
      const timing = { duration: 640, delay: index * 520, easing: "ease-in-out" };
      const image = panel.querySelector(".avs-art img");
      const dialogue = panel.querySelector(".avs-dialogue");
      return [
        image?.animate([{ scale: 1 }, { scale: 1.04, offset: .48 }, { scale: 1 }], timing),
        dialogue?.animate([{ translate: "0 0" }, { translate: "0 -5px", offset: .48 }, { translate: "0 0" }], timing),
      ].filter((animation): animation is Animation => Boolean(animation));
    });
  }

  return <figure id={storyAnchor(story)} className="avs" data-panels={panels.length} data-visual-story={story} aria-labelledby={titleId}>
    <header>
      <div><p className="avs-series">Arkez Visual Stories</p><Heading id={titleId}>{title}</Heading></div>
      <div className="avs-controls">
        {canPlay && <button type="button" onClick={play}><Play size={16} aria-hidden="true" /> Animar viñetas</button>}
        {reel && <button className="avs-reel-toggle" type="button" aria-controls={reelId} aria-expanded={showReel} onClick={() => setShowReel((visible) => !visible)}>
          {showReel ? "Cerrar reel" : "Ver reel"}
        </button>}
      </div>
    </header>
    {reel && <div className="avs-reel" id={reelId} hidden={!showReel}>
      {showReel && <video controls playsInline preload="none" width="360" height="640" aria-label={title}>
        <source src={reel} type="video/mp4" />
        Tu navegador no puede reproducir este video. Puedes leer las viñetas a continuación.
      </video>}
    </div>}
    <ol className="avs-panels" ref={strip} aria-label={`Historieta en ${panels.length} viñetas`}>
      {panels.map(({ alt, caption, dialogue }, index) => <li key={caption} data-panel={index + 1}>
        <div className="avs-art"><img src={image.src} width={image.width} height={image.height} alt={alt} loading="lazy" decoding="async" /><span className="avs-dialogue">{dialogue}</span></div>
        <p>{caption}</p>
      </li>)}
    </ol>
    <figcaption>{takeaway}</figcaption>
  </figure>;
}
