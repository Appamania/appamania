// Live numbers from public APIs, fetched on the server at ISR time. Any failure keeps the checked-in value.

export type PubScore = { points: number; likes: number; downloads: number };

/** pub.dev /api/packages/{name}/score. Unknown shape → null. */
export function parseScore(data: unknown): PubScore | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (typeof d.grantedPoints !== "number") return null;
  return {
    points: d.grantedPoints,
    likes: typeof d.likeCount === "number" ? d.likeCount : 0,
    downloads: typeof d.downloadCount30Days === "number" ? d.downloadCount30Days : 0,
  };
}

export async function fetchPubScore(name: string): Promise<PubScore | null> {
  try {
    const res = await fetch(`https://pub.dev/api/packages/${encodeURIComponent(name)}/score`, {
      headers: { Accept: "application/vnd.pub.v2+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return parseScore(await res.json());
  } catch {
    return null;
  }
}

/** "12.4k" for big counts, plain below 1000. */
export function compact(n: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
