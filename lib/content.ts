import "server-only";
import snapshot from "@/content/snapshot.json";
import { z } from "zod";
import { getDoc, listDocs } from "@/lib/firestore";
import { fetchPubScore, type PubScore } from "@/lib/live";
import {
  AppSchema,
  chooseList,
  PackageSchema,
  PostSchema,
  SettingsSchema,
  WorkSchema,
  type AppEntry,
  type PackageEntry,
  type Post,
  type Settings,
  type Work,
} from "@/lib/schemas";

function checked<T>(name: "work" | "posts" | "apps" | "packages", schema: z.ZodType<T>): T[] {
  const parsed = z.array(schema).safeParse(snapshot[name]);
  if (!parsed.success) throw new Error(`content/snapshot.json ${name}: ${z.prettifyError(parsed.error)}`);
  return parsed.data;
}

function keys() {
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return project && key ? { project, key } : null;
}

async function load<T>(
  name: "work" | "posts" | "apps" | "packages",
  schema: z.ZodType<T>,
  sort: (rows: T[]) => T[],
): Promise<T[]> {
  const fallback = checked(name, schema);
  const k = keys();
  if (!k) return sort(fallback);
  try {
    const docs = await listDocs(k.project, k.key, name);
    const remote = docs.map((doc) => ({ slug: doc.id, ...doc.fields }));
    return sort(chooseList(remote, schema, fallback));
  } catch {
    return sort(fallback);
  }
}

const byOrder = <T extends { order: number }>(rows: T[]) => rows.sort((a, b) => a.order - b.order);
const byDate = (rows: Post[]) => rows.sort((a, b) => (a.date < b.date ? 1 : -1));

export function getWork() {
  return load("work", WorkSchema, byOrder);
}
export function getPosts() {
  return load("posts", PostSchema, byDate);
}
export function getApps() {
  return load("apps", AppSchema, byOrder);
}
export type LivePackage = PackageEntry & Partial<Pick<PubScore, "likes" | "downloads">>;

/** Packages with live pub.dev points, likes and 30-day downloads. Checked-in points stay when pub.dev is unreachable. */
export async function getPackages(): Promise<LivePackage[]> {
  const rows = await load("packages", PackageSchema, byOrder);
  return Promise.all(
    rows.map(async (row) => {
      const score = await fetchPubScore(row.name);
      return score ? { ...row, points: score.points, likes: score.likes, downloads: score.downloads } : row;
    }),
  );
}

const noSettings: Settings = { notice: "", availability: "" };

/** settings/site, edited in admin. Missing or broken means empty, never a failed page. */
export async function getSettings(): Promise<Settings> {
  const k = keys();
  if (!k) return noSettings;
  try {
    const parsed = SettingsSchema.safeParse((await getDoc(k.project, k.key, "settings/site")) ?? {});
    return parsed.success ? parsed.data : noSettings;
  } catch {
    return noSettings;
  }
}

export type { AppEntry, PackageEntry, Post, Settings, Work };
