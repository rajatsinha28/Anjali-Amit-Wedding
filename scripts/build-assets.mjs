import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(projectRoot, "assets-src");
const outputRoot = path.join(projectRoot, "public", "assets");
const runtimeManifestPath = path.join(projectRoot, "src", "generated", "assets-manifest.json");
const publicManifestPath = path.join(outputRoot, "manifest.json");
const configPath = path.join(sourceRoot, "manifest.json");

const config = JSON.parse(await readFile(configPath, "utf8"));
if (!Array.isArray(config.assets))
  throw new Error("assets-src/manifest.json must contain assets[]");

await mkdir(outputRoot, { recursive: true });
const generated = { generatedAt: null, assets: {} };

for (const entry of config.assets) {
  if (!entry.id || !entry.input || !entry.output || !Array.isArray(entry.widths)) {
    throw new Error(`Invalid asset manifest entry: ${JSON.stringify(entry)}`);
  }
  const inputPath = path.join(sourceRoot, entry.input);
  const metadata = await sharp(inputPath).metadata();
  if (!metadata.width || !metadata.height)
    throw new Error(`Cannot read dimensions for ${entry.id}`);

  const widths = [...new Set(entry.widths.map(Number))]
    .filter((width) => Number.isInteger(width) && width > 0)
    .sort((a, b) => a - b);
  if (widths.length === 0) throw new Error(`${entry.id} must define at least one positive width`);

  const outputDirectory = path.join(outputRoot, path.dirname(entry.output));
  const outputBase = path.basename(entry.output);
  await mkdir(outputDirectory, { recursive: true });

  const avif = [];
  const webp = [];
  let canonical = null;
  const largestWidth = widths.at(-1);

  for (const requestedWidth of widths) {
    const suffix = requestedWidth === largestWidth ? "" : `-${requestedWidth}w`;
    const avifRelative = `${entry.output}${suffix}.avif`.replaceAll("\\", "/");
    const webpRelative = `${entry.output}${suffix}.webp`.replaceAll("\\", "/");
    const avifPath = path.join(outputDirectory, `${outputBase}${suffix}.avif`);
    const webpPath = path.join(outputDirectory, `${outputBase}${suffix}.webp`);

    const basePipeline = () =>
      sharp(inputPath).autoOrient().resize({ width: requestedWidth, withoutEnlargement: true });
    const avifInfo = await basePipeline().avif({ quality: 52, effort: 6 }).toFile(avifPath);
    const webpInfo = await basePipeline().webp({ quality: 80, effort: 5 }).toFile(webpPath);
    avif.push({ src: `/assets/${avifRelative}`, width: avifInfo.width });
    webp.push({ src: `/assets/${webpRelative}`, width: webpInfo.width });
    if (requestedWidth === largestWidth) canonical = webpInfo;
  }

  generated.assets[entry.id] = {
    width: canonical.width,
    height: canonical.height,
    avif,
    webp,
    fallback: webp.at(-1).src,
  };
}

const serialized = `${JSON.stringify(generated, null, 2)}\n`;
await writeFile(runtimeManifestPath, serialized, "utf8");
await writeFile(publicManifestPath, serialized, "utf8");
console.log(`Generated ${Object.keys(generated.assets).length} asset entries.`);
