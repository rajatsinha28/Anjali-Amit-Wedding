import { useEffect, useRef, useState } from "react";
import { assets } from "../../config/assets";
import { copy } from "../../config/copy";
import { wedding } from "../../config/wedding";
import { Img } from "../Img/Img";
import styles from "./ClosingPortrait.module.css";

export function ClosingPortrait() {
  const sectionRef = useRef<HTMLElement>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [ringActive, setRingActive] = useState(false);
  const portrait = wedding.closingPortrait ?? wedding.heroPortrait;
  const focal = portrait.focalPosition;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRingActive(Boolean(entry?.isIntersecting) && !document.hidden),
      { threshold: 0.08 },
    );
    const updateVisibility = () => {
      if (document.hidden) setRingActive(false);
      else if (section.getBoundingClientRect().top < innerHeight) setRingActive(true);
    };
    observer.observe(section);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="closing-heading"
      data-testid="closing-portrait"
      data-ring-active={ringActive}
    >
      <div className={styles.strands} aria-hidden="true">
        <span />
        <span />
      </div>
      <div className={styles.portraitRing}>
        <svg viewBox="0 0 300 300" className={styles.ringText} aria-hidden="true">
          <defs>
            <path id="closing-ring-path" d="M150,20 a130,130 0 1,1 -0.1,0" />
          </defs>
          <text>
            <textPath href="#closing-ring-path" startOffset="2%">
              ANJALI ✦ AMIT ✦ 10 DECEMBER 2026 ✦ ANJALI ✦ AMIT ✦ 10 DECEMBER 2026 ✦
            </textPath>
          </text>
        </svg>
        <div className={styles.photo}>
          <Img
            asset={assets[portrait.assetId] ?? null}
            fallbackLabel={portrait.assetId}
            alt={portrait.alt}
            sizes="260px"
            style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
          />
        </div>
      </div>
      <p className={styles.accessibleDate}>Anjali and Amit · 10 December 2026</p>
      <h2 id="closing-heading">{copy.closing.heading}</h2>
      <p className={styles.blessing}>{copy.closing.blessing}</p>
      <div className={styles.divider} aria-hidden="true">
        <i />
      </div>
      <p className={styles.invited}>{copy.closing.invitedBy}</p>
      <p className={styles.families}>{copy.closing.families}</p>
      <div className={styles.noteControl}>
        <button
          type="button"
          className={styles.noteButton}
          aria-expanded={noteOpen}
          aria-controls="family-special-note"
          onClick={() => setNoteOpen((current) => !current)}
        >
          <span aria-hidden="true">✉</span>
          <strong>{noteOpen ? copy.closing.familyNoteClose : copy.closing.familyNote}</strong>
          <i aria-hidden="true" />
        </button>
        <small>A heartfelt message from Neeraj &amp; Roli</small>
      </div>
      <div
        id="family-special-note"
        className={styles.letter}
        data-open={noteOpen}
        hidden={!noteOpen}
      >
        <div>
          {copy.familyLetter.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <footer>
        <strong>Anjali &amp; Amit</strong>
        <span>{wedding.weddingDate.display}</span>
        {wedding.venue.name ? <span>{wedding.venue.name}</span> : null}
      </footer>
    </section>
  );
}
