import "server-only";
import snapshot from "@/content/snapshot.json";
import { z } from "zod";
import { fetchPubScore, type PubScore } from "@/lib/live";
import {
  AppSchema,
  PackageSchema,
  PostSchema,
  WorkSchema,
  type AppEntry,
  type PackageEntry,
  type Post,
  type Work,
} from "@/lib/schemas";

function checked<T>(name: "work" | "apps" | "packages" | "posts", schema: z.ZodType<T>): T[] {
  const parsed = z.array(schema).safeParse(snapshot[name]);
  if (!parsed.success) throw new Error(`content/snapshot.json ${name}: ${z.prettifyError(parsed.error)}`);
  return parsed.data;
}

const byOrder = <T extends { order: number }>(rows: T[]) => rows.sort((a, b) => a.order - b.order);
const byDate = (rows: Post[]) => rows.sort((a, b) => (a.date < b.date ? 1 : -1));

export async function getWork() {
  return byOrder(checked("work", WorkSchema));
}
export async function getApps() {
  return byOrder(checked("apps", AppSchema));
}

/** Blog posts from content/snapshot.json, newest first. */
export async function getPosts() {
  return byDate(checked("posts", PostSchema));
}

export type LivePackage = PackageEntry & Partial<Pick<PubScore, "likes" | "downloads">>;

/** Packages with live pub.dev points, likes and 30-day downloads. Checked-in points stay when pub.dev is unreachable. */
export async function getPackages(): Promise<LivePackage[]> {
  const rows = byOrder(checked("packages", PackageSchema));
  return Promise.all(
    rows.map(async (row) => {
      const score = await fetchPubScore(row.name);
      return score ? { ...row, points: score.points, likes: score.likes, downloads: score.downloads } : row;
    }),
  );
}

export type { AppEntry, PackageEntry, Post, Work };
