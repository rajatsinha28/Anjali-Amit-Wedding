import { useEffect, useState } from "react";
import { wedding } from "../../config/wedding";
import { getCountdown, padCountdown } from "../../lib/countdown";
import styles from "./DateReveal.module.css";

export function BaraatCountdown() {
  const [parts, setParts] = useState(() => getCountdown(wedding.baraat.startISO));

  useEffect(() => {
    const update = () => setParts(getCountdown(wedding.baraat.startISO));
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  if (parts.complete) return <p className={styles.countdownComplete}>The celebration is here!</p>;
  const values = [
    [parts.days, "days"],
    [parts.hours, "hours"],
    [parts.minutes, "minutes"],
    [parts.seconds, "seconds"],
  ] as const;
  return (
    <div
      className={styles.countdown}
      aria-label={`${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes and ${parts.seconds} seconds until the baraat`}
    >
      {values.map(([value, label]) => (
        <div className={styles.countdownPart} key={label} aria-hidden="true">
          <strong>{padCountdown(value)}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
