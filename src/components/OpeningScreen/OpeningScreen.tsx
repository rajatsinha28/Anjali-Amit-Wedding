import { useCallback, useEffect, useRef, useState } from "react";
import { assets } from "../../config/assets";
import { copy } from "../../config/copy";
import { loadGsap, prefersReducedMotion } from "../../lib/motion";
import { DustCanvas } from "../DustCanvas/DustCanvas";
import { Img } from "../Img/Img";
import { RoyalDoors } from "../RoyalDoors/RoyalDoors";
import styles from "./OpeningScreen.module.css";

interface RippleState {
  readonly id: number;
  readonly x: number;
  readonly y: number;
}

interface OpeningScreenProps {
  readonly active: boolean;
  readonly onHeroReveal: () => void;
  readonly onComplete: () => void;
}

export function OpeningScreen({ active, onHeroReveal, onComplete }: OpeningScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const idolRef = useRef<HTMLDivElement>(null);
  const shlokaRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [idle, setIdle] = useState(false);
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const [opening, setOpening] = useState(false);
  const openedRef = useRef(false);
  const completedRef = useRef(false);

  const completeTransition = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (!active || opening) return;
    let cancelled = false;
    let timeline: ReturnType<Awaited<ReturnType<typeof loadGsap>>["timeline"]> | null = null;
    const loopTweens: Array<{ kill: () => void }> = [];
    const idleTimer = window.setTimeout(() => setIdle(true), 6000);

    void loadGsap().then((gsap) => {
      if (cancelled) return;
      const heading = headingRef.current;
      const halo = haloRef.current;
      const idol = idolRef.current;
      const lines = shlokaRef.current?.querySelectorAll("span");
      const button = buttonRef.current;
      if (!heading || !halo || !idol || !lines || !button) return;

      if (prefersReducedMotion()) {
        gsap.to([heading, halo, idol, lines, button], {
          opacity: 1,
          duration: 0.5,
          clearProps: "transform",
        });
        return;
      }

      timeline = gsap.timeline();
      timeline
        .fromTo(halo, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.2 }, 0)
        .fromTo(idol, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 1.4 }, 0.2)
        .fromTo(heading, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6)
        .fromTo(lines, { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.25 }, 1.1)
        .fromTo(button, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 1.9)
        .add(() => {
          gsap.set([heading, idol, lines, button], { clearProps: "transform" });
          loopTweens.push(
            gsap.to(halo, {
              scale: 1.04,
              duration: 3,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
            }),
            gsap.to(idol, {
              y: -3,
              duration: 4,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
            }),
          );
        }, 2.6);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(idleTimer);
      timeline?.kill();
      loopTweens.forEach((tween) => tween.kill());
    };
  }, [active, opening]);

  useEffect(() => {
    if (!opening) return;
    const reduced = prefersReducedMotion();
    const heroDelay = reduced ? 160 : 1800;
    const completeDelay = reduced ? 700 : 2750;
    const heroTimer = window.setTimeout(onHeroReveal, heroDelay);
    const completeTimer = window.setTimeout(completeTransition, completeDelay);
    return () => {
      window.clearTimeout(heroTimer);
      window.clearTimeout(completeTimer);
    };
  }, [completeTransition, onHeroReveal, opening]);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setRipple({
      id: Date.now(),
      x: event.clientX ? event.clientX - bounds.left : bounds.width / 2,
      y: event.clientY ? event.clientY - bounds.top : bounds.height / 2,
    });
  };

  const openInvitation = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (openedRef.current) return;
    openedRef.current = true;
    createRipple(event);
    setOpening(true);
    setIdle(false);
  }, []);

  const shlokaLines = copy.opening.shloka.split("\n");

  return (
    <section
      className={`${styles.screen} ${opening ? styles.opening : ""}`}
      aria-label="Open Anjali and Amit's wedding invitation"
    >
      <RoyalDoors opening={opening} onComplete={completeTransition} />
      <DustCanvas active={active} />
      {(["topLeft", "topRight", "bottomLeft", "bottomRight"] as const).map((position) => (
        <Img
          key={position}
          asset={assets["corner-tl"] ?? null}
          fallbackLabel="florals/corner-tl.webp"
          alt=""
          className={`${styles.corner} ${styles[position]}`}
          sizes="230px"
        />
      ))}
      <div className={styles.content} data-testid="ganesh-overlay">
        <h1 ref={headingRef} className={styles.heading} lang="hi">
          {copy.opening.heading}
        </h1>
        <div className={styles.idolStage}>
          <div ref={haloRef} className={styles.halo} aria-hidden="true" />
          <div className={styles.sparkles} aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <i key={index} />
            ))}
          </div>
          <div ref={idolRef} className={styles.idolWrap}>
            <Img
              asset={assets["ganesh-idol"] ?? null}
              fallbackLabel="ganesh/ganesh-idol.webp"
              alt="Lord Ganesha seated in blessing"
              sizes="(max-width: 560px) 68vw, 340px"
              priority
              draggable={false}
            />
          </div>
          <div className={styles.diyas} aria-hidden="true">
            <Img
              asset={assets.diya ?? null}
              fallbackLabel="ganesh/diya.webp"
              alt=""
              className={styles.diya}
              sizes="52px"
            />
            <Img
              asset={assets.diya ?? null}
              fallbackLabel="ganesh/diya.webp"
              alt=""
              className={styles.diya}
              sizes="52px"
            />
          </div>
        </div>
        <p ref={shlokaRef} className={styles.shloka} lang="sa">
          {shlokaLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <div ref={buttonRef} className={`${styles.buttonWrap} ${idle ? styles.idle : ""}`}>
          <button
            className={styles.button}
            type="button"
            onClick={openInvitation}
            disabled={opening}
          >
            {copy.opening.button}
            {ripple ? (
              <span
                key={ripple.id}
                className={styles.ripple}
                style={{ left: ripple.x, top: ripple.y }}
                aria-hidden="true"
              />
            ) : null}
          </button>
        </div>
      </div>
    </section>
  );
}
