import { assets } from "../../config/assets";
import { Img } from "../Img/Img";
import styles from "./RoyalDoors.module.css";

interface RoyalDoorsProps {
  readonly opening: boolean;
  readonly onComplete: () => void;
}

export function RoyalDoors({ opening, onComplete }: RoyalDoorsProps) {
  return (
    <div
      className={`${styles.doors} ${opening ? styles.opening : ""}`}
      aria-hidden="true"
      data-testid="royal-doors"
    >
      <div className={`${styles.panel} ${styles.left}`}>
        <Img
          asset={assets["door-left"] ?? null}
          fallbackLabel="palace/door-left.webp"
          alt=""
          className={styles.image}
          sizes="50vw"
          priority
        />
      </div>
      <div
        className={`${styles.panel} ${styles.right}`}
        onAnimationEnd={(event) => {
          if (opening && event.currentTarget === event.target) onComplete();
        }}
      >
        <Img
          asset={assets["door-right"] ?? null}
          fallbackLabel="palace/door-right.webp"
          alt=""
          className={styles.image}
          sizes="50vw"
          priority
        />
      </div>
      <span className={styles.seam} />
      <span className={styles.bloom} />
    </div>
  );
}
