import { describe, expect, it } from "vitest";
import { copy } from "./copy";
import { wedding } from "./wedding";

describe("wedding configuration", () => {
  it("contains the confirmed couple and date details", () => {
    expect(wedding.couple.bride).toEqual({
      name: "Anjali",
      relation: "Daughter of",
      parents: "Mr. Neeraj Srivastava and Mrs. Roli Srivastava",
    });
    expect(wedding.couple.groom).toEqual({
      name: "Amit",
      relation: "Son of",
      parents: "Mr. Rajendra Prasad and Mrs. Rajpati Devi",
    });
    expect(wedding.weddingDate).toEqual({ display: "10 DECEMBER 2026", iso: "2026-12-10" });
  });

  it("stores exact event timestamps and calendar-only durations", () => {
    expect(
      wedding.events.map(({ startISO, durationMinutes }) => [startISO, durationMinutes]),
    ).toEqual([
      ["2026-12-09T11:00:00+05:30", 120],
      ["2026-12-09T19:00:00+05:30", 180],
      ["2026-12-10T20:00:00+05:30", 240],
    ]);
  });

  it("stores Chancellor Club for ceremony calendars and the separate venue section", () => {
    for (const event of wedding.events) {
      expect(event.venue).toEqual({
        name: "Chancellor Club",
        address: "K-1, Ashiyana Colony, Lucknow, Uttar Pradesh 226012",
        mapsUrl: "https://maps.app.goo.gl/W2WcjwtsU7tR4kS16?g_st=aw",
        lat: null,
        lng: null,
      });
    }
    expect(wedding.venue).toEqual(wedding.events[0]?.venue);
  });

  it("keeps the baraat countdown separate from the wedding ceremony", () => {
    expect(wedding.events[2]?.startISO).toBe("2026-12-10T20:00:00+05:30");
    expect(wedding.baraat).toEqual({
      title: "Baraat",
      startISO: "2026-12-10T21:00:00+05:30",
      dateDisplay: "10 DECEMBER 2026",
      timeDisplay: "9:00 PM",
    });
  });

  it("keeps unsupplied RSVP details empty and configures continuous music", () => {
    expect(wedding.rsvp.whatsappNumber).toBeNull();
    expect(wedding.music).toEqual({
      src: "/assets/audio/krishna-mahabharata-full.mp3",
      volume: 0.35,
      initialStartSeconds: 0,
      loopStartSeconds: 0,
    });
  });

  it("preserves the exact sacred text line break", () => {
    expect(copy.opening.shloka.split("\n")).toHaveLength(2);
    expect(copy.opening.shloka).toContain("।");
    expect(copy.opening.shloka).toContain("॥");
  });

  it("keeps the approved portrait metadata and canonical hero copy", () => {
    expect(wedding.heroPortrait).toEqual({
      assetId: "hero-portrait",
      alt: "Anjali and Amit standing together",
      focalPosition: { x: 60, y: 43 },
    });
    expect(copy.hero).toEqual({
      sacredHeading: "शुभ विवाह",
      scrollHint: "Scroll to discover",
    });
  });

  it("keeps the simplified Hindi family invitation copy in configuration", () => {
    expect(copy.welcome.heading).toBe("आप सादर आमंत्रित हैं");
    expect(copy.welcome.presence).toBe("आपकी उपस्थिति और आशीर्वाद हमारे लिए बहुत खास होंगे।");
    expect(copy.welcome.celebration).toBe("आइए, हमारे साथ प्रेम, खुशी और मिलन का यह उत्सव मनाएँ।");
    expect(copy.welcome.bride).toBe("अंजलि");
    expect(copy.welcome.groom).toBe("अमित");
    expect(copy.welcome.signature).toBe("नीरज एवं रोली श्रीवास्तव");
    expect(Object.values(copy.welcome).join(" ")).not.toContain("रोहिणी");
  });
});
