import { useEffect, useState } from "react";
import { assets } from "../../config/assets";
import { waitForCriticalAssets } from "../../lib/preload";
import { Img } from "../Img/Img";
import styles from "./Preloader.module.css";

export interface PreloaderProps {
  readonly onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let exitTimer = 0;
    void waitForCriticalAssets().then(() => {
      if (cancelled) return;
      setLeaving(true);
      exitTimer = window.setTimeout(onComplete, 500);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`${styles.preloader} ${leaving ? styles.leaving : ""}`}
      aria-label="Loading the wedding invitation"
      aria-live="polite"
      data-testid="preloader"
    >
      <div className={styles.content}>
        <Img
          asset={assets.diya ?? null}
          fallbackLabel="ganesh/diya.webp"
          alt=""
          className={styles.diya}
          priority
        />
        <div className={styles.progress} aria-hidden="true" />
        <p className={styles.label}>Preparing your invitation</p>
      </div>
    </div>
  );
}
