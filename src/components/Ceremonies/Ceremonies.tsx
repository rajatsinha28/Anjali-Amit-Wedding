import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { assets } from "../../config/assets";
import { copy } from "../../config/copy";
import { wedding, type WeddingEvent } from "../../config/wedding";
import { getDeviceTier, type DeviceTier } from "../../lib/device";
import { prefersReducedMotion } from "../../lib/motion";
import { Img } from "../Img/Img";
import { RoyalUnrollingScroll } from "../RoyalUnrollingScroll/RoyalUnrollingScroll";
import styles from "./Ceremonies.module.css";

interface CeremonyVisual {
  readonly artId: string;
  readonly particle: "marigold" | "gold" | "rose";
  readonly floatingArt: boolean;
}

const visuals: Record<WeddingEvent["id"], CeremonyVisual> = {
  haldi: { artId: "ceremony-haldi", particle: "marigold", floatingArt: true },
  "mehendi-sangeet": {
    artId: "ceremony-mehendi-sangeet",
    particle: "gold",
    floatingArt: true,
  },
  wedding: { artId: "ceremony-wedding-mandap", particle: "rose", floatingArt: false },
};

const particleSeeds = Array.from({ length: 12 }, (_, index) => ({
  x: 5 + ((index * 37) % 90),
  delay: -((index * 1.17) % 8),
  duration: 6.8 + ((index * 0.83) % 4.5),
  drift: -14 + ((index * 19) % 29),
  size: 4 + (index % 4),
}));

export function Ceremonies() {
  return (
    <section
      className={styles.section}
      aria-labelledby="celebrations-heading"
      data-testid="ceremonies"
    >
      <h2 id="celebrations-heading">{copy.sections.ceremonies}</h2>
      <p className={styles.dates}>9–10 December 2026</p>
      <div className={styles.list}>
        {wedding.events.map((event, index) => (
          <div key={event.id}>
            <CeremonyChapter event={event} />
            {index < wedding.events.length - 1 ? <CeremonyConnector /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function CeremonyChapter({ event }: { readonly event: WeddingEvent }) {
  const ref = useRef<HTMLElement>(null);
  const burstTimer = useRef<number | null>(null);
  const cooldownUntil = useRef(0);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [deviceTier, setDeviceTier] = useState<DeviceTier>(() => getDeviceTier());
  const [burst, setBurst] = useState(0);
  const visual = visuals[event.id];
  const [day, month, year] = event.dateDisplay.split(" ");
  const active = inView && pageVisible && !prefersReducedMotion();
  const ambientCount = deviceTier === "low" ? 5 : deviceTier === "mid" ? 8 : 10;
  const particles = useMemo(() => particleSeeds.slice(0, ambientCount), [ambientCount]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const activeObserver = new IntersectionObserver(
      ([entry]) =>
        setInView(Boolean(entry?.isIntersecting) && (entry?.intersectionRatio ?? 0) >= 0.15),
      { rootMargin: "-12% 0px -12%", threshold: [0, 0.15] },
    );
    activeObserver.observe(root);
    const onVisibility = () => setPageVisible(!document.hidden);
    const onTier = (event: Event) =>
      setDeviceTier((event as CustomEvent<DeviceTier>).detail ?? getDeviceTier());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("device-tier-change", onTier);
    return () => {
      activeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("device-tier-change", onTier);
    };
  }, []);

  useEffect(
    () => () => {
      if (burstTimer.current !== null) window.clearTimeout(burstTimer.current);
    },
    [],
  );

  const celebrate = useCallback(() => {
    const now = performance.now();
    if (now < cooldownUntil.current || prefersReducedMotion()) return;
    cooldownUntil.current = now + 1500;
    setBurst((current) => current + 1);
    if (burstTimer.current !== null) window.clearTimeout(burstTimer.current);
    burstTimer.current = window.setTimeout(() => setBurst(0), 1100);
  }, []);

  return (
    <RoyalUnrollingScroll
      id={`ceremony:${event.id}`}
      label={`${event.title} royal scroll`}
      openDurationMs={1900}
      className={styles.ceremonyScroll}
    >
      <article
        ref={ref}
        className={`${styles.chapter} ${styles[event.id]}`}
        data-active={active}
        data-device-tier={deviceTier}
        data-testid={`ceremony-${event.id}`}
      >
        <div className={styles.frame} data-frame aria-hidden="true" />
        <Img
          asset={assets["corner-tl"] ?? null}
          fallbackLabel="florals/corner-tl"
          alt=""
          className={`${styles.cornerFloral} ${styles.cornerLeft}`}
          sizes="120px"
        />
        <Img
          asset={assets["corner-tl"] ?? null}
          fallbackLabel="florals/corner-tl"
          alt=""
          className={`${styles.cornerFloral} ${styles.cornerRight}`}
          sizes="120px"
        />
        <div className={styles.ambient} aria-hidden="true" data-particle={visual.particle}>
          {particles.map((particle, index) => (
            <span
              key={index}
              style={
                {
                  "--particle-x": `${particle.x}%`,
                  "--particle-delay": `${particle.delay}s`,
                  "--particle-duration": `${particle.duration}s`,
                  "--particle-drift": `${particle.drift}px`,
                  "--particle-size": `${particle.size}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className={styles.topMotif} data-scroll-reveal aria-hidden="true">
          <span />
          <b>◆</b>
          <span />
        </div>
        <h3 data-title data-scroll-reveal>
          {event.title}
        </h3>
        <div className={styles.divider} data-title-divider data-scroll-reveal aria-hidden="true">
          <i />
        </div>
        <button
          type="button"
          className={styles.artButton}
          data-scroll-reveal
          onClick={celebrate}
          aria-label={`Celebrate ${event.title.toLowerCase()}`}
          data-floating={visual.floatingArt}
        >
          <span className={styles.artGlow} data-art-glow aria-hidden="true" />
          <span className={styles.artStage} data-ceremony-art>
            <Img
              asset={assets[visual.artId] ?? null}
              fallbackLabel={visual.artId}
              alt=""
              className={styles.art}
              sizes="(max-width: 767px) 68vw, 310px"
            />
          </span>
          {burst > 0 ? (
            <span className={styles.burst} key={burst} data-burst aria-hidden="true">
              {particleSeeds.slice(0, deviceTier === "low" ? 6 : 9).map((particle, index) => (
                <i
                  key={index}
                  style={
                    {
                      "--burst-angle": `${index * (360 / (deviceTier === "low" ? 6 : 9))}deg`,
                      "--burst-distance": `${42 + particle.size * 4}px`,
                    } as CSSProperties
                  }
                />
              ))}
            </span>
          ) : null}
        </button>
        <div className={styles.information} data-scroll-reveal>
          <time className={styles.date} dateTime={event.startISO}>
            <strong data-date-day>{day?.padStart(2, "0")}</strong>
            <span data-date-rest>
              {month} {year}
            </span>
          </time>
          <div className={styles.time} data-time>
            <ClockIcon />
            <time dateTime={event.startISO}>{event.timeDisplay}</time>
          </div>
        </div>
        <div
          className={`${styles.divider} ${styles.lowerDivider}`}
          data-lower-divider
          data-scroll-reveal
          aria-hidden="true"
        >
          <i />
        </div>
        <p data-description data-scroll-reveal>
          {event.description}
        </p>
        <div className={styles.bottomFlourish} data-scroll-reveal aria-hidden="true">
          ◆
        </div>
      </article>
    </RoyalUnrollingScroll>
  );
}

function CeremonyConnector() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const connector = ref.current;
    if (!connector) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(connector);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={styles.connector} data-revealed={revealed} aria-hidden="true">
      <span />
      <i />
    </div>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5l3.2 2" />
    </svg>
  );
}
