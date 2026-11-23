export function createDirectionsUrl(destination: string): string {
  const params = new URLSearchParams({ api: "1", destination });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function createMapEmbedUrl(placeName: string, address: string): string {
  const query = encodeURIComponent(`${placeName}, ${address}`);
  return `https://www.google.com/maps?q=${query}&output=embed`;
}

export function createMobileMapUrl(
  placeName: string,
  address: string,
  googleMapsUrl: string,
  userAgent: string,
): string {
  if (/iPad|iPhone|iPod/i.test(userAgent)) {
    const params = new URLSearchParams({ q: placeName, address });
    return `https://maps.apple.com/?${params.toString()}`;
  }

  return googleMapsUrl;
}
