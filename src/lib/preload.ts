import { assets } from "../config/assets";

const criticalAssetIds = [
  "ganesh-idol",
  "door-left",
  "door-right",
  "hero-portrait",
  "portrait-jharokha",
] as const;

function decodeImage(src: string): Promise<void> {
  const image = new Image();
  image.src = src;
  return image.decode().catch(() => undefined);
}

function delay(duration: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

export async function waitForCriticalAssets(): Promise<void> {
  const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
  const imageDecodes = criticalAssetIds.map((id) => {
    const asset = assets[id];
    const source = asset?.avif.at(-1)?.src ?? asset?.fallback;
    return source ? decodeImage(source) : Promise.resolve();
  });
  await Promise.all([
    delay(900),
    Promise.race([Promise.all([fonts, ...imageDecodes]), delay(4000)]),
  ]);
}
