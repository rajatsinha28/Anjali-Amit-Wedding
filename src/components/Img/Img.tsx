import { useState, type ImgHTMLAttributes } from "react";
import type { AssetSource, AssetSpec } from "../../config/assets";
import { PlaceholderArt } from "../PlaceholderArt/PlaceholderArt";

function toSrcSet(sources: readonly AssetSource[]): string {
  return sources.map(({ src, width }) => `${src} ${width}w`).join(", ");
}

export interface ImgProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "width" | "height"
> {
  readonly asset: AssetSpec | null;
  readonly fallbackLabel: string;
  readonly priority?: boolean;
}

export function Img({
  asset,
  fallbackLabel,
  priority = false,
  alt,
  className,
  sizes = "100vw",
  ...imgProps
}: ImgProps) {
  const [failed, setFailed] = useState(false);
  if (!asset || failed) {
    return <PlaceholderArt label={fallbackLabel} className={className} />;
  }

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={toSrcSet(asset.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={toSrcSet(asset.webp)} sizes={sizes} />
      <img
        {...imgProps}
        src={asset.fallback}
        alt={alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onError={() => setFailed(true)}
      />
    </picture>
  );
}
