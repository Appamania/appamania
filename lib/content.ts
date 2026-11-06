import "server-only";
import snapshot from "@/content/snapshot.json";
import { z } from "zod";
import {
  AppSchema,
  chooseList,
  listDocs,
  PackageSchema,
  PostSchema,
  WorkSchema,
  type AppEntry,
  type PackageEntry,
  type Post,
  type Work,
} from "@/lib/store";

function checked<T>(name: "work" | "posts" | "apps" | "packages", schema: z.ZodType<T>): T[] {
  const parsed = z.array(schema).safeParse(snapshot[name]);
  if (!parsed.success) throw new Error(`content/snapshot.json ${name}: ${z.prettifyError(parsed.error)}`);
  return parsed.data;
}

async function load<T>(
  name: "work" | "posts" | "apps" | "packages",
  schema: z.ZodType<T>,
  sort: (rows: T[]) => T[],
): Promise<T[]> {
  const fallback = checked(name, schema);
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!project || !key) return sort(fallback);
  try {
    const docs = await listDocs(project, key, name);
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
export function getPackages() {
  return load("packages", PackageSchema, byOrder);
}

export type { AppEntry, PackageEntry, Post, Work };
