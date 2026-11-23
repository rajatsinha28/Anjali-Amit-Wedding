import { describe, expect, it } from "vitest";
import { createDirectionsUrl, createMapEmbedUrl, createMobileMapUrl } from "./maps";

describe("Google Maps directions", () => {
  it("encodes only the configured destination", () => {
    const url = new URL(createDirectionsUrl("Venue Name, Lucknow"));
    expect(url.origin).toBe("https://www.google.com");
    expect(url.searchParams.get("api")).toBe("1");
    expect(url.searchParams.get("destination")).toBe("Venue Name, Lucknow");
  });
});

describe("mobile venue links", () => {
  const name = "Chancellor Club";
  const address = "K-1, Ashiyana Colony, Lucknow, Uttar Pradesh 226012";
  const googleMapsUrl = "https://maps.app.goo.gl/example";

  it("uses Apple Maps on iOS", () => {
    const url = new URL(createMobileMapUrl(name, address, googleMapsUrl, "iPhone"));
    expect(url.origin).toBe("https://maps.apple.com");
    expect(url.searchParams.get("q")).toBe(name);
    expect(url.searchParams.get("address")).toBe(address);
  });

  it("preserves the confirmed Google Maps universal link on Android", () => {
    expect(createMobileMapUrl(name, address, googleMapsUrl, "Android")).toBe(googleMapsUrl);
  });

  it("builds an embeddable map URL for the visual preview", () => {
    const url = new URL(createMapEmbedUrl(name, address));
    expect(url.origin).toBe("https://www.google.com");
    expect(url.searchParams.get("q")).toBe(`${name}, ${address}`);
    expect(url.searchParams.get("output")).toBe("embed");
  });
});
