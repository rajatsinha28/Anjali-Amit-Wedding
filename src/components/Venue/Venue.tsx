import { assets } from "../../config/assets";
import { copy } from "../../config/copy";
import { wedding } from "../../config/wedding";
import { createMapEmbedUrl, createMobileMapUrl } from "../../lib/maps";
import { Img } from "../Img/Img";
import styles from "./Venue.module.css";

export function Venue() {
  const { name, address, mapsUrl } = wedding.venue;
  if (!name || !address || !mapsUrl) return null;
  const mobileMapUrl = createMobileMapUrl(name, address, mapsUrl, navigator.userAgent);
  return (
    <section className={styles.section} aria-labelledby="venue-heading" data-testid="venue">
      <div className={styles.royalCard}>
        <Img
          asset={assets["corner-tl"] ?? null}
          fallbackLabel="floral corner"
          alt=""
          className={`${styles.corner} ${styles.cornerLeft}`}
          sizes="(max-width: 767px) 150px, 220px"
        />
        <Img
          asset={assets["corner-tl"] ?? null}
          fallbackLabel="floral corner"
          alt=""
          className={`${styles.corner} ${styles.cornerRight}`}
          sizes="(max-width: 767px) 150px, 220px"
        />

        <header className={styles.heading}>
          <p className={styles.eyebrow}>The royal destination</p>
          <h2 id="venue-heading">{copy.sections.venue}</h2>
          <div className={styles.headingOrnament} aria-hidden="true">
            <span />
            <i>◆</i>
            <span />
          </div>
          <h3>{name}</h3>
          <p className={styles.address}>{address}</p>
        </header>

        <div className={styles.mapStage}>
          <span className={styles.mapCrown} aria-hidden="true">
            <i />
            <b>◆</b>
            <i />
          </span>
          <div className={styles.mapFrame}>
            <iframe
              src={createMapEmbedUrl(name, address)}
              title={`Map showing ${name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex={-1}
            />
            <a
              className={styles.mapTap}
              href={mobileMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${name} in your maps app`}
            >
              <span className={styles.pin} aria-hidden="true" />
              <span className={styles.mapAction} aria-hidden="true">
                <strong>Open in Maps</strong>
                <small>Tap for directions</small>
              </span>
            </a>
          </div>
        </div>

        <p className={styles.mobileNote}>Opens in your phone’s maps application</p>
      </div>
    </section>
  );
}
