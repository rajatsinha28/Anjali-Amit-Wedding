import { useState } from "react";
import { copy } from "../../config/copy";
import { wedding } from "../../config/wedding";
import { createBaraatICS, createGoogleCalendarUrl } from "../../lib/calendar";
import styles from "./DateReveal.module.css";

export function CalendarAction() {
  const [open, setOpen] = useState(false);
  const venue = [wedding.venue.name, wedding.venue.address].filter(Boolean).join(", ") || null;
  const downloadICS = () => {
    const url = URL.createObjectURL(
      new Blob([createBaraatICS(venue)], { type: "text/calendar;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "anjali-amit-baraat.ics";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className={styles.calendar}>
      <button
        type="button"
        className={styles.calendarButton}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {copy.dateReveal.calendarAction}
      </button>
      {open ? (
        <div className={styles.calendarSheet} role="group" aria-label="Calendar options">
          <button type="button" onClick={downloadICS}>
            Add to phone calendar (.ics)
          </button>
          <a href={createGoogleCalendarUrl(venue)} target="_blank" rel="noopener noreferrer">
            Open in Google Calendar
          </a>
          <small>Your calendar app will ask you to confirm and save the event.</small>
        </div>
      ) : null}
    </div>
  );
}
