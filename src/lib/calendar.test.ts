import { describe, expect, it } from "vitest";
import { createBaraatICS, createGoogleCalendarUrl } from "./calendar";

describe("baraat calendar integration", () => {
  it("creates a valid CRLF calendar with exact UTC instant and alarm", () => {
    const value = createBaraatICS("Venue, Lucknow");
    expect(value).toContain("DTSTART:20261210T153000Z\r\n");
    expect(value).toContain("UID:baraat-20261210@anjali-amit-wedding");
    expect(value).toContain("TRIGGER:-PT30M");
    expect(value).toContain("LOCATION:Venue\\, Lucknow");
  });

  it("creates the one-hour Google Calendar template", () => {
    const url = new URL(createGoogleCalendarUrl());
    expect(url.searchParams.get("dates")).toBe("20261210T153000Z/20261210T163000Z");
  });
});
