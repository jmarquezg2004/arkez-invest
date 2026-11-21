import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function mountScrollSequence(stage: HTMLElement, onStep: (step: number) => void, onPlay: (active: boolean) => void) {
  gsap.registerPlugin(ScrollTrigger);
  let playback: gsap.core.Tween | undefined;
  let trigger: ScrollTrigger | undefined;
  const headerHeight = () => {
    const site = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
    const section = document.querySelector(".ax-subnav")?.getBoundingClientRect().height ?? 0;
    return site + section;
  };
  const scrollTo = (top: number) => window.scrollTo({ top, behavior: "instant" });
  const context = gsap.context(() => {
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: stage, pin: true,
        start: () => `top ${Math.ceil(headerHeight()) + 8}px`,
        end: () => `+=${Math.round(window.innerHeight * 1.55)}`,
        scrub: .28, invalidateOnRefresh: true,
      },
      onUpdate: function () { onStep(this.progress() < .29 ? 0 : this.progress() < .72 ? 1 : 2); },
    });
    trigger = timeline.scrollTrigger;
    timeline
      .to(".ax-sheet-record", { xPercent: -18, yPercent: 30, rotate: -9, scale: .79 }, 0)
      .to(".ax-sheet-scenario", { xPercent: -24, yPercent: -18, rotate: -1, scale: 1.12 }, 0)
      .to(".ax-sheet-check", { xPercent: 3, yPercent: -14, rotate: 5, scale: .86 }, 0)
      .to(".ax-beam", { scaleX: .57 }, 0)
      .to(".ax-sheet-record", { xPercent: -14, yPercent: 1, scale: .82, rotate: -6 }, .6)
      .to(".ax-sheet-scenario", { xPercent: -14, yPercent: 32, scale: .83, rotate: -3 }, .6)
      .to(".ax-sheet-check", { xPercent: -26, yPercent: -44, scale: 1.2, rotate: 0 }, .6)
      .to(".ax-beam", { scaleX: 1 }, .6);
  },stage);

  function pause() {
    playback?.kill();
    playback = undefined;
    onPlay(false);
  }
  function play() {
    pause();
    if (!trigger) return;
    trigger.refresh();
    const driver = { top: trigger.start + 1 };
    scrollTo(driver.top);
    onPlay(true);
    playback = gsap.to(driver, {
      top: Math.max(trigger.start + 1, Math.min(trigger.end - 2, ScrollTrigger.maxScroll(window))),
      duration: 4.3, ease: "none", onUpdate: () => scrollTo(driver.top), onComplete: () => {
        playback = undefined;
        onPlay(false);
      },
    });
  }
  function reset() {
    pause();
    if (trigger) scrollTo(trigger.start + 1);
  }
  stage.addEventListener("wheel", pause, { passive: true });
  stage.addEventListener("touchstart", pause, { passive: true });

  return { play, pause, reset, dispose() {
    playback?.kill();
    stage.removeEventListener("wheel", pause);
    stage.removeEventListener("touchstart", pause);
    context.revert();
  } };
}
