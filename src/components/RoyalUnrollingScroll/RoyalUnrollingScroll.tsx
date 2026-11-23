import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { assets } from "../../config/assets";
import { loadScrollTrigger, prefersReducedMotion } from "../../lib/motion";
import { Img } from "../Img/Img";
import styles from "./RoyalUnrollingScroll.module.css";

type ScrollState = "closed" | "opening" | "opened";

interface RoyalUnrollingScrollProps {
  readonly id: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly openDurationMs?: number;
  readonly label: string;
  readonly variant?: "welcome" | "ceremony";
}

export function RoyalUnrollingScroll({
  id,
  children,
  className = "",
  openDurationMs = 2000,
  label,
  variant = "ceremony",
}: RoyalUnrollingScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();
  const [state, setState] = useState<ScrollState>(reducedMotion ? "opened" : "closed");

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reducedMotion) {
      root.removeAttribute("inert");
      return;
    }
    const paper = root.querySelector<HTMLElement>("[data-scroll-paper]");
    const lowerRoll = root.querySelector<HTMLElement>("[data-scroll-lower-roll]");
    const movingEdge = root.querySelector<HTMLElement>("[data-scroll-moving-edge]");
    const curl = root.querySelector<HTMLElement>("[data-scroll-curl]");
    if (!paper || !lowerRoll || !movingEdge || !curl) return;

    root.setAttribute("inert", "");
    let cancelled = false;
    let openedOnce = false;
    let cleanup = () => undefined;
    void loadScrollTrigger().then(async ({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      await document.fonts?.ready;
      if (cancelled) return;
      const revealUnits = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-reveal]"));
      const travel = () => Math.max(0, paper.offsetHeight - lowerRoll.offsetHeight);
      gsap.set(paper, { "--scroll-reveal": 96 });
      gsap.set([lowerRoll, movingEdge, curl], { y: 0 });
      gsap.set(revealUnits, { autoAlpha: 0.74, filter: "blur(2px)", y: 8 });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" },
        onStart: () => setState("opening"),
        onComplete: () => {
          setState("opened");
          root.dataset.scrollProgress = "1.000";
          root.removeAttribute("inert");
        },
        onUpdate: () => {
          const progress = timeline.progress();
          root.dataset.scrollProgress = progress.toFixed(3);
          if (progress < 0.98) root.setAttribute("inert", "");
        },
      });
      timeline.to(paper, { "--scroll-reveal": 0, duration: 1 }, 0);
      timeline.to(
        [lowerRoll, movingEdge, curl],
        { y: () => travel(), duration: 1, ease: "power2.inOut" },
        0,
      );
      timeline.to(
        lowerRoll,
        { keyframes: [{ rotationX: -9 }, { rotationX: 7 }, { rotationX: 0 }], duration: 1 },
        0,
      );
      revealUnits.forEach((unit, index) => {
        timeline.to(
          unit,
          { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 0.24, ease: "power1.out" },
          0.15 + index * Math.min(0.12, 0.62 / Math.max(1, revealUnits.length)),
        );
      });
      timeline.duration(openDurationMs / 1000);

      const open = () => {
        if (openedOnce) return;
        openedOnce = true;
        setState("opening");
        timeline.play();
      };
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top 78%",
        once: true,
        onEnter: open,
        onEnterBack: open,
      });
      const resizeObserver = new ResizeObserver(() => {
        timeline.invalidate();
        trigger.refresh();
      });
      resizeObserver.observe(paper);
      cleanup = () => {
        resizeObserver.disconnect();
        trigger.kill();
        timeline.kill();
      };
      ScrollTrigger.refresh();
      if (root.getBoundingClientRect().top <= window.innerHeight * 0.78) open();
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [openDurationMs, reducedMotion]);

  return (
    <div
      ref={rootRef}
      className={`${styles.scroll} ${styles[variant]} ${className}`}
      data-royal-scroll={id}
      data-scroll-state={state}
      data-scroll-progress={reducedMotion ? "1.000" : "0.000"}
      aria-label={label}
      style={
        {
          "--open-duration": `${openDurationMs}ms`,
        } as CSSProperties
      }
    >
      <Roller className={styles.topRoll} variant={variant} />
      <div className={styles.paper} data-scroll-paper>
        {children}
      </div>
      <div className={styles.paperCurl} data-scroll-curl aria-hidden="true" />
      <div className={styles.movingEdge} data-scroll-moving-edge aria-hidden="true" />
      <Roller className={styles.lowerRoll} variant={variant} lower />
    </div>
  );
}

function Roller({
  className,
  variant,
  lower = false,
}: {
  readonly className: string | undefined;
  readonly variant: "welcome" | "ceremony";
  readonly lower?: boolean;
}) {
  if (variant === "welcome") {
    return (
      <div
        className={`${className ?? ""} ${styles.illustratedRoller}`}
        data-scroll-lower-roll={lower ? "" : undefined}
        aria-hidden="true"
      >
        <Img
          asset={assets["royal-scroll-roller"] ?? null}
          fallbackLabel="royal scroll roller"
          alt=""
          sizes="(max-width: 767px) 96vw, 620px"
        />
      </div>
    );
  }
  return (
    <div className={className} data-scroll-lower-roll={lower ? "" : undefined} aria-hidden="true">
      <i />
      <span />
      <i />
    </div>
  );
}
