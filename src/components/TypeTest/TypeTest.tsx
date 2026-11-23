import { copy } from "../../config/copy";
import styles from "./TypeTest.module.css";

export default function TypeTest() {
  return (
    <article className={styles.page} data-testid="type-test">
      <h1>Invitation typography specimen</h1>
      <section className={styles.sample}>
        <h2>Devanagari invocation</h2>
        <p lang="sa" className={styles.shloka}>
          {copy.opening.shloka}
        </p>
        <p lang="hi" className={styles.conjuncts}>
          क्ष र्य त्र ण्ड सर्व
        </p>
      </section>
      <section className={styles.sample}>
        <h2>Display and body</h2>
        <p className={styles.script}>Anjali & Amit</p>
        <p>
          With the blessings of the Almighty and our elders, we invite you to celebrate with us.
        </p>
      </section>
    </article>
  );
}
