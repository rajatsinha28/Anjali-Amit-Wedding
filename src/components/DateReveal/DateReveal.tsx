import { useCallback, useState } from "react";
import { copy } from "../../config/copy";
import { wedding } from "../../config/wedding";
import { BaraatCountdown } from "./BaraatCountdown";
import { CalendarAction } from "./CalendarAction";
import { CelebrationCanvas } from "./CelebrationCanvas";
import { ScratchCanvas } from "./ScratchCanvas";
import styles from "./DateReveal.module.css";

export function DateReveal() {
  const [revealed, setRevealed] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const reveal = useCallback(() => {
    setRevealed((current) => {
      if (current) return current;
      setCelebrate(true);
      return true;
    });
  }, []);

  return (
    <section className={styles.section} aria-labelledby="date-heading" data-testid="date-reveal">
      <h2 id="date-heading">{copy.dateReveal.heading}</h2>
      <p className={styles.accessibleSubtitle}>
        {copy.dateReveal.title}. {copy.dateReveal.subtitle}
      </p>
      <div className={`${styles.card} ${revealed ? styles.revealed : ""}`}>
        <div className={styles.date} aria-hidden={!revealed}>
          <span>Thursday</span>
          <div>
            <strong>10</strong>
            <em>December</em>
          </div>
          <b>2026</b>
        </div>
        {!revealed ? <ScratchCanvas onReveal={reveal} /> : null}
        <span className={styles.fullDate} aria-live="polite">
          {revealed ? copy.dateReveal.date : ""}
        </span>
      </div>
      {celebrate ? <CelebrationCanvas /> : null}
      <div className={styles.instructionSlot}>
        {revealed ? (
          <p className={styles.result}>{copy.dateReveal.revealedMessage}</p>
        ) : (
          <>
            <p>{copy.dateReveal.instruction}</p>
            <button type="button" className={styles.revealButton} onClick={reveal}>
              {copy.dateReveal.fallbackButton}
            </button>
          </>
        )}
      </div>
      <p className={styles.countdownLabel}>{copy.dateReveal.countdownLabel}</p>
      <BaraatCountdown />
      <p className={styles.baraatTarget}>
        Baraat arrives · {wedding.baraat.dateDisplay} · {wedding.baraat.timeDisplay} IST
      </p>
      <div className={styles.calendarSlot}>{revealed ? <CalendarAction /> : null}</div>
    </section>
  );
}
