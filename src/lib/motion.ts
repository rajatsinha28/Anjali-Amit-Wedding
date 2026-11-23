type GsapInstance = (typeof import("gsap"))["gsap"];

export const motionDefaults = {
  ease: "power4.out",
  duration: 0.9,
} as const;

let gsapPromise: Promise<GsapInstance> | null = null;
let scrollTriggerPromise: Promise<{
  gsap: GsapInstance;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
}> | null = null;

export function prefersReducedMotion(): boolean {
  return (
    document.documentElement.dataset.reducedMotion === "true" ||
    (typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}

export function loadGsap(): Promise<GsapInstance> {
  gsapPromise ??= import("gsap").then(({ gsap }) => {
    gsap.defaults(motionDefaults);
    return gsap;
  });
  return gsapPromise;
}

export function loadScrollTrigger() {
  scrollTriggerPromise ??= Promise.all([loadGsap(), import("gsap/ScrollTrigger")]).then(
    ([gsap, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    },
  );
  return scrollTriggerPromise;
}

export async function setMotionTimeScale(scale: number): Promise<void> {
  const gsap = await loadGsap();
  gsap.globalTimeline.timeScale(scale);
}
