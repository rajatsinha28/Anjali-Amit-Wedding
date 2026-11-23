import { assets } from "../../config/assets";
import { copy } from "../../config/copy";
import { Img } from "../Img/Img";
import { RoyalUnrollingScroll } from "../RoyalUnrollingScroll/RoyalUnrollingScroll";
import styles from "./WelcomeLetter.module.css";

export function WelcomeLetter() {
  return (
    <section
      className={styles.section}
      aria-labelledby="welcome-heading"
      data-testid="welcome-letter"
    >
      <div className={styles.stage}>
        <RoyalUnrollingScroll
          id="welcome"
          label="अंजलि और अमित के शुभ विवाह का शाही आमंत्रण"
          openDurationMs={2300}
          variant="welcome"
          className={styles.scroll}
        >
          <article className={styles.panel} data-testid="welcome-scroll-paper" lang="hi">
            <Img
              asset={assets["royal-farman-border"] ?? null}
              fallbackLabel="royal farman border"
              alt=""
              className={styles.borderArt}
              sizes="(max-width: 767px) 90vw, 560px"
            />
            <div className={styles.content}>
              <div className={styles.crest} data-scroll-reveal aria-hidden="true">
                <span>❧</span>
              </div>
              <h2 id="welcome-heading" className={styles.heading} data-scroll-reveal>
                {copy.welcome.heading}
              </h2>
              <div className={styles.ornament} data-scroll-reveal aria-hidden="true">
                <span />
                <i>◆</i>
                <span />
              </div>
              <div className={styles.letter}>
                <p data-scroll-reveal>
                  {copy.welcome.invitationBeforeBride}
                  <strong>{copy.welcome.bride}</strong>
                  {copy.welcome.invitationBetweenNames}
                  <strong>{copy.welcome.groom}</strong>
                  {copy.welcome.invitationAfterGroom}
                </p>
                <p data-scroll-reveal>{copy.welcome.presence}</p>
                <p data-scroll-reveal>{copy.welcome.celebration}</p>
              </div>
              <div className={styles.signoff} data-scroll-reveal>
                <span>{copy.welcome.closing}</span>
                <em>{copy.welcome.regards}</em>
                <strong>{copy.welcome.signature}</strong>
              </div>
            </div>
          </article>
        </RoyalUnrollingScroll>
      </div>
    </section>
  );
}
