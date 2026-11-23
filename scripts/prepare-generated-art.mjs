import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const originals = path.join(projectRoot, "assets-src", "generated-originals");
const masters = path.join(projectRoot, "assets-src", "masters");

async function prepareContained(input, output, width, height) {
  await mkdir(path.dirname(output), { recursive: true });
  await sharp(input)
    .autoOrient()
    .resize({ width, height, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(output);
}

await prepareContained(
  path.join(originals, "ganesh-idol-original.png"),
  path.join(masters, "ganesh", "ganesh-idol.png"),
  1600,
  2000,
);
await prepareContained(
  path.join(originals, "diya-original.png"),
  path.join(masters, "ganesh", "diya.png"),
  600,
  600,
);
await prepareContained(
  path.join(originals, "corner-tl-original.png"),
  path.join(masters, "florals", "corner-tl.png"),
  1200,
  1200,
);
await prepareContained(
  path.join(originals, "hero-frame-original.png"),
  path.join(masters, "palace", "arch-frame.png"),
  1200,
  1800,
);
await prepareContained(
  path.join(originals, "toran-original.png"),
  path.join(masters, "florals", "toran.png"),
  1800,
  600,
);
await prepareContained(
  path.join(originals, "petal-original.png"),
  path.join(masters, "florals", "petal.png"),
  480,
  320,
);
await prepareContained(
  path.join(originals, "portrait-jharokha-original.png"),
  path.join(masters, "palace", "portrait-jharokha.png"),
  1200,
  1500,
);
await prepareContained(
  path.join(originals, "hero-side-string-original.png"),
  path.join(masters, "florals", "hero-side-string.png"),
  400,
  1600,
);
await prepareContained(
  path.join(originals, "haldi-ceremony-original.png"),
  path.join(masters, "ceremonies", "haldi.png"),
  1200,
  900,
);
await prepareContained(
  path.join(originals, "mehendi-sangeet-original.png"),
  path.join(masters, "ceremonies", "mehendi-sangeet.png"),
  1200,
  900,
);
await prepareContained(
  path.join(originals, "wedding-mandap-original.png"),
  path.join(masters, "ceremonies", "wedding-mandap.png"),
  1200,
  900,
);

const doorInput = path.join(originals, "door-pair-original.png");
const { width: doorWidth, height: doorHeight } = await sharp(doorInput).metadata();
if (!doorWidth || !doorHeight) throw new Error("Could not read the generated door pair");
const halfWidth = Math.floor(doorWidth / 2);
const palaceDirectory = path.join(masters, "palace");
await mkdir(palaceDirectory, { recursive: true });

await sharp(doorInput)
  .extract({ left: 0, top: 0, width: halfWidth, height: doorHeight })
  .resize({ width: 1080, height: 2400, fit: "cover", position: "right" })
  .png({ compressionLevel: 9 })
  .toFile(path.join(palaceDirectory, "door-left.png"));
await sharp(doorInput)
  .extract({ left: doorWidth - halfWidth, top: 0, width: halfWidth, height: doorHeight })
  .resize({ width: 1080, height: 2400, fit: "cover", position: "left" })
  .png({ compressionLevel: 9 })
  .toFile(path.join(palaceDirectory, "door-right.png"));

console.log("Prepared invitation artwork masters.");
