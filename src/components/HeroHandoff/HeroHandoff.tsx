import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { assets } from "../../config/assets";
import { copy } from "../../config/copy";
import { wedding } from "../../config/wedding";
import { loadGsap, prefersReducedMotion } from "../../lib/motion";
import { Img } from "../Img/Img";
import { PetalCanvas } from "../PetalCanvas/PetalCanvas";
import { RoyalFrame } from "../RoyalFrame/RoyalFrame";
import styles from "./HeroHandoff.module.css";

interface HeroHandoffProps {
  readonly active: boolean;
  readonly reveal: boolean;
  readonly skipEntrance: boolean;
}

export function HeroHandoff({ active, reveal, skipEntrance }: HeroHandoffProps) {
  const rootRef = useRef<HTMLElement>(null);
  const revealPlayedRef = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const [forceSettled, setForceSettled] = useState(skipEntrance);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!reveal || skipEntrance) return;
    const fallback = window.setTimeout(() => setForceSettled(true), 5600);
    return () => window.clearTimeout(fallback);
  }, [reveal, skipEntrance]);

  useLayoutEffect(() => {
    if (!reveal || revealPlayedRef.current) return;
    let cancelled = false;
    let timeline: ReturnType<Awaited<ReturnType<typeof loadGsap>>["timeline"]> | null = null;
    void loadGsap()
      .then((gsap) => {
        if (cancelled || revealPlayedRef.current || !rootRef.current) return;
        revealPlayedRef.current = true;
        const root = rootRef.current;
        const portrait = root.querySelector<HTMLElement>("[data-portrait-image]");
        const jharokha = root.querySelector<HTMLElement>("[data-jharokha]");
        const heading = root.querySelector<HTMLElement>("[data-sacred-heading]");
        const strings = root.querySelectorAll<HTMLElement>("[data-hero-string]");
        const brideName = root.querySelector<HTMLElement>("[data-bride-name]");
        const ampersand = root.querySelector<HTMLElement>("[data-ampersand]");
        const groomName = root.querySelector<HTMLElement>("[data-groom-name]");
        const hint = root.querySelector<HTMLElement>("[data-scroll-hint]");
        const all = [
          portrait,
          jharokha,
          heading,
          ...strings,
          brideName,
          ampersand,
          groomName,
          hint,
        ].filter(Boolean);
        if (skipEntrance || prefersReducedMotion()) {
          gsap.set(all, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px) brightness(1)",
            clipPath: "inset(-20% -10%)",
          });
          setForceSettled(true);
          return;
        }
        timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => setForceSettled(true),
        });
        timeline
          .addLabel("portraitReveal", 0)
          .fromTo(
            portrait,
            { opacity: 0, scale: 1.035, filter: "blur(14px) brightness(0.82)" },
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px) brightness(1)",
              duration: 2.2,
              ease: "power2.inOut",
            },
            "portraitReveal",
          )
          .fromTo(
            jharokha,
            { opacity: 0, y: 9, scale: 0.975 },
            { opacity: 1, y: 0, scale: 1, duration: 1.3 },
            0.5,
          )
          .fromTo(
            strings,
            { opacity: 0, y: -8 },
            { opacity: 1, y: 0, duration: 1.15, stagger: 0.12 },
            0.62,
          )
          .fromTo(heading, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.82 }, 1)
          .addLabel("namesReveal", 1.85)
          .fromTo(
            brideName,
            { clipPath: "inset(0 100% 0 0)", opacity: 0, y: 8 },
            {
              clipPath: "inset(-20% -10%)",
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "power2.inOut",
            },
            "namesReveal",
          )
          .fromTo(
            ampersand,
            { opacity: 0, scale: 0.65 },
            { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.35)" },
            2.95,
          )
          .fromTo(
            groomName,
            { clipPath: "inset(0 100% 0 0)", opacity: 0, y: 8 },
            {
              clipPath: "inset(-20% -10%)",
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "power2.inOut",
            },
            3.45,
          )
          .addLabel("ready", 4.75)
          .fromTo(hint, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.5 }, "ready");
      })
      .catch(() => setForceSettled(true));
    return () => {
      cancelled = true;
      timeline?.kill();
    };
  }, [reveal, skipEntrance]);

  const focal = wedding.heroPortrait.focalPosition;
  return (
    <section
      ref={rootRef}
      className={`${styles.hero} ${skipEntrance || forceSettled ? styles.settled : ""}`}
      aria-label="Anjali and Amit's wedding invitation"
      data-testid="hero-handoff"
    >
      <RoyalFrame>
        <PetalCanvas active={active} />
        <div className={styles.content}>
          <p className={styles.sacredHeading} lang="hi" data-sacred-heading>
            {copy.hero.sacredHeading}
          </p>
          <div className={styles.portraitStage} data-testid="hero-portrait-stage">
            <div
              className={styles.portraitCrop}
              data-portrait-image
              data-testid="hero-portrait-image"
            >
              <Img
                asset={assets[wedding.heroPortrait.assetId] ?? null}
                fallbackLabel="couple/hero-portrait.webp"
                alt={wedding.heroPortrait.alt}
                className={styles.portrait}
                sizes="(max-width: 767px) 68vw, 480px"
                priority
                style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
              />
            </div>
            <div
              className={styles.jharokha}
              data-jharokha
              data-testid="hero-jharokha"
              aria-hidden="true"
            >
              <Img
                asset={assets["portrait-jharokha"] ?? null}
                fallbackLabel="palace/portrait-jharokha.webp"
                alt=""
                className={styles.jharokhaImage}
                sizes="(max-width: 767px) 74vw, 530px"
              />
            </div>
          </div>
          <div className={styles.names}>
            <div className={styles.person}>
              <h1 className={styles.name} data-bride-name>
                {wedding.couple.bride.name}
              </h1>
            </div>
            <div className={styles.ampersand} data-ampersand aria-label="and">
              <span />
              &amp;
              <span />
            </div>
            <div className={styles.person}>
              <h1 className={styles.name} data-groom-name>
                {wedding.couple.groom.name}
              </h1>
            </div>
          </div>
          <div
            className={`${styles.scrollHint} ${scrolled ? styles.hidden : ""}`}
            data-scroll-hint
            data-testid="scroll-hint"
          >
            <span>{copy.hero.scrollHint}</span>
            <i aria-hidden="true" />
          </div>
        </div>
        <PetalCanvas active={active} foreground />
      </RoyalFrame>
    </section>
  );
}
