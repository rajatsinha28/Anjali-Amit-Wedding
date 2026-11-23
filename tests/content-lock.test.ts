import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { copy } from "../src/config/copy";
import { wedding } from "../src/config/wedding";

const forbidden = [
  "tentative",
  "to be confirmed",
  "TBC",
  "TBA",
  "EVENING –",
  "7:00 PM – 8:00 PM",
  "8:00 PM or 9:00 PM",
  "Lorem",
];

const visibleLocked = [
  copy.opening.heading,
  ...copy.opening.shloka.split("\n"),
  ...copy.opening.transliteration.split("\n"),
  copy.opening.button,
  wedding.couple.bride.name,
  wedding.couple.bride.relation,
  wedding.couple.bride.parents,
  wedding.couple.groom.name,
  wedding.couple.groom.relation,
  wedding.couple.groom.parents,
  copy.hero.scrollHint,
  ...Object.values(copy.welcome),
  ...Object.values(copy.dateReveal),
  ...Object.values(copy.album),
  copy.sections.ceremonies,
  ...Object.values(copy.closing),
  ...wedding.events.flatMap((event) => [
    event.title,
    event.dateDisplay,
    event.timeDisplay,
    event.venue?.name ?? "",
    event.description,
  ]),
  ...copy.familyLetter,
];

function textFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const candidate = path.join(directory, name);
    return statSync(candidate).isDirectory() ? textFiles(candidate) : [candidate];
  });
}

function normalizeVisibleText(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

describe("locked invitation content", () => {
  it("keeps every canonical value in NFC form", () => {
    const canonical = [
      ...visibleLocked,
      copy.opening.shloka,
      copy.opening.transliteration,
      wedding.weddingDate.iso,
      ...wedding.events.map((event) => event.startISO),
    ];
    for (const value of canonical) expect(value.normalize("NFC")).toBe(value);
    expect(copy.opening.shloka).toBe(
      "वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    );
  });

  it("contains every locked value in the no-script production invitation", () => {
    const distIndex = path.resolve("dist/index.html");
    expect(existsSync(distIndex), "Run the production build before this test").toBe(true);
    const dom = new JSDOM(readFileSync(distIndex, "utf8"));
    const noScript = normalizeVisibleText(
      dom.window.document.querySelector("noscript")?.textContent ?? "",
    );
    for (const value of visibleLocked) {
      expect(noScript).toContain(normalizeVisibleText(value));
    }
  });

  it("contains no forbidden copy in source or built HTML", () => {
    const source = textFiles(path.resolve("src"))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    const builtHtml = readFileSync(path.resolve("dist/index.html"), "utf8");
    for (const value of forbidden) {
      expect(source).not.toContain(value);
      expect(builtHtml).not.toContain(value);
    }
  });

  it("keeps the initial production JavaScript below 60 KB gzip and strips dev tools", () => {
    const manifest = JSON.parse(readFileSync(path.resolve("dist/.vite/manifest.json"), "utf8"));
    const entry = manifest["index.html"];
    expect(entry?.file).toBeTruthy();
    const initialJs = readFileSync(path.resolve("dist", entry.file));
    expect(gzipSync(initialJs).byteLength).toBeLessThan(60 * 1024);
    const allJavaScript = textFiles(path.resolve("dist/assets"))
      .filter((file) => file.endsWith(".js"))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    expect(allJavaScript).not.toContain("Invitation dev panel");
    expect(allJavaScript).not.toContain("Invitation typography specimen");
  });
});
