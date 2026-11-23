import type { PropsWithChildren } from "react";
import { assets } from "../../config/assets";
import { Img } from "../Img/Img";
import styles from "./RoyalFrame.module.css";

export function RoyalFrame({ children }: PropsWithChildren) {
  return (
    <div className={styles.frame}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`${styles.string} ${styles.left}`} data-hero-string>
        <Img
          asset={assets["hero-side-string"] ?? null}
          fallbackLabel="florals/hero-side-string.webp"
          alt=""
          sizes="160px"
        />
      </div>
      <div className={`${styles.string} ${styles.right}`} data-hero-string>
        <Img
          asset={assets["hero-side-string"] ?? null}
          fallbackLabel="florals/hero-side-string.webp"
          alt=""
          sizes="160px"
        />
      </div>
      {children}
    </div>
  );
}
