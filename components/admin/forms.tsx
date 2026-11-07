"use client";

import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import type { AppEntry, PackageEntry, Post, Work } from "@/lib/schemas";
import { Lines, Upload, type Media } from "./Fields";

export type FormProps<T> = {
  draft: T;
  set: (next: T) => void;
  formKey: string;
  media: Media;
  /** Top-level field errors from the last save attempt. */
  errors: Record<string, string | undefined>;
};

export function WorkForm({ draft, set, formKey, media, errors }: FormProps<Work>) {
  return (
    <>
      <Input
        label="Slug"
        name="slug"
        error={errors.slug}
        required
        value={draft.slug}
        onChange={(e) => set({ ...draft, slug: e.target.value })}
      />
      <Input
        label="Order"
        name="order"
        error={errors.order}
        type="number"
        required
        value={String(draft.order)}
        onChange={(e) => set({ ...draft, order: Number(e.target.value) })}
      />
      <Input
        label="Eyebrow"
        name="eyebrow"
        error={errors.eyebrow}
        required
        value={draft.eyebrow}
        onChange={(e) => set({ ...draft, eyebrow: e.target.value })}
      />
      <Input
        label="Title"
        name="title"
        error={errors.title}
        required
        value={draft.title}
        onChange={(e) => set({ ...draft, title: e.target.value })}
      />
      <Input
        label="Accent"
        name="accent"
        error={errors.accent}
        required
        value={draft.accent}
        onChange={(e) => set({ ...draft, accent: e.target.value })}
      />
      <Textarea
        label="Lead"
        name="lead"
        error={errors.lead}
        required
        value={draft.lead}
        onChange={(e) => set({ ...draft, lead: e.target.value })}
      />
      <Input
        label="Teaser label"
        name="teaser-label"
        required
        value={draft.teaser.label}
        onChange={(e) => set({ ...draft, teaser: { ...draft.teaser, label: e.target.value } })}
      />
      <Input
        label="Teaser title"
        name="teaser-title"
        required
        value={draft.teaser.title}
        onChange={(e) => set({ ...draft, teaser: { ...draft.teaser, title: e.target.value } })}
      />
      <Textarea
        label="Teaser summary"
        name="teaser-summary"
        required
        value={draft.teaser.summary}
        onChange={(e) => set({ ...draft, teaser: { ...draft.teaser, summary: e.target.value } })}
      />
      {draft.stats.map((stat, i) => (
        <div key={i} className="grid gap-3 min-[900px]:grid-cols-2">
          <Input
            label={`Stat ${i + 1} label`}
            name={`stat-${i}-label`}
            required
            value={stat.label}
            onChange={(e) =>
              set({ ...draft, stats: draft.stats.map((row, n) => (n === i ? { ...row, label: e.target.value } : row)) })
            }
          />
          <Input
            label={`Stat ${i + 1} value`}
            name={`stat-${i}-value`}
            required
            value={stat.value}
            onChange={(e) =>
              set({ ...draft, stats: draft.stats.map((row, n) => (n === i ? { ...row, value: e.target.value } : row)) })
            }
          />
        </div>
      ))}
      <Input
        label="Problem title"
        name="problem-title"
        required
        value={draft.problemTitle}
        onChange={(e) => set({ ...draft, problemTitle: e.target.value })}
      />
      <Lines
        key={`${formKey}-problem`}
        label="Problem"
        name="problem"
        error={errors.problem}
        value={draft.problem}
        onChange={(problem) => set({ ...draft, problem })}
      />
      {draft.steps.map((step, i) => (
        <div key={i} className="grid gap-3">
          <Input
            label={`Step ${i + 1} title`}
            name={`step-${i}-title`}
            required
            value={step.title}
            onChange={(e) =>
              set({ ...draft, steps: draft.steps.map((row, n) => (n === i ? { ...row, title: e.target.value } : row)) })
            }
          />
          <Textarea
            label={`Step ${i + 1}`}
            name={`step-${i}-body`}
            required
            value={step.body}
            onChange={(e) =>
              set({ ...draft, steps: draft.steps.map((row, n) => (n === i ? { ...row, body: e.target.value } : row)) })
            }
          />
        </div>
      ))}
      <div className="flex gap-3">
        {draft.steps.length < 4 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => set({ ...draft, steps: [...draft.steps, { title: "", body: "" }] })}
          >
            Add step
          </Button>
        )}
        {draft.steps.length > 2 && (
          <Button type="button" variant="outline" onClick={() => set({ ...draft, steps: draft.steps.slice(0, -1) })}>
            Remove step
          </Button>
        )}
      </div>
      <Lines
        key={`${formKey}-checks`}
        label="Checks"
        name="checks"
        error={errors.checks}
        value={draft.checks ?? []}
        onChange={(checks) => set({ ...draft, checks: checks.length ? checks : undefined })}
      />
      <Input
        label="Result title"
        name="result-title"
        required
        value={draft.result.title}
        onChange={(e) => set({ ...draft, result: { ...draft.result, title: e.target.value } })}
      />
      <Textarea
        label="Result"
        name="result-body"
        required
        value={draft.result.body}
        onChange={(e) => set({ ...draft, result: { ...draft.result, body: e.target.value } })}
      />
      {draft.versions.map((version, i) => (
        <div key={i} className="grid gap-3 min-[900px]:grid-cols-2">
          <Input
            label={`From ${i + 1}`}
            name={`from-${i}`}
            required
            value={version.from}
            onChange={(e) =>
              set({
                ...draft,
                versions: draft.versions.map((row, n) => (n === i ? { ...row, from: e.target.value } : row)),
              })
            }
          />
          <Input
            label={`To ${i + 1}`}
            name={`to-${i}`}
            required
            value={version.to}
            onChange={(e) =>
              set({
                ...draft,
                versions: draft.versions.map((row, n) => (n === i ? { ...row, to: e.target.value } : row)),
              })
            }
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => set({ ...draft, versions: [...draft.versions, { from: "", to: "" }] })}
      >
        Add version
      </Button>
      <Lines
        key={`${formKey}-stack`}
        label="Stack"
        name="stack"
        error={errors.stack}
        value={draft.stack}
        onChange={(stack) => set({ ...draft, stack })}
      />
      <Upload
        label="Cover image"
        name="cover"
        error={errors.cover}
        prefix={`${draft.slug || "work"}-cover`}
        media={media}
        accept="image/*"
        value={draft.cover ? [draft.cover] : []}
        onChange={([cover]) => set({ ...draft, cover })}
      />
      <Upload
        label="Video"
        name="video"
        error={errors.video}
        prefix={`${draft.slug || "work"}-video`}
        media={media}
        accept="video/mp4"
        value={draft.video ? [draft.video] : []}
        onChange={([video]) => set({ ...draft, video })}
      />
    </>
  );
}

export const emptyWork = (): Work => ({
  slug: "",
  order: 1,
  eyebrow: "",
  title: "",
  accent: "",
  lead: "",
  teaser: { label: "", title: "", summary: "" },
  stats: [
    { label: "", value: "" },
    { label: "", value: "" },
    { label: "", value: "" },
  ],
  problemTitle: "",
  problem: [],
  steps: [
    { title: "", body: "" },
    { title: "", body: "" },
  ],
  result: { title: "", body: "" },
  versions: [{ from: "", to: "" }],
  stack: [],
});

export function PostForm({ draft, set, formKey, errors }: FormProps<Post>) {
  return (
    <>
      <Input
        label="Slug"
        name="slug"
        error={errors.slug}
        required
        value={draft.slug}
        onChange={(e) => set({ ...draft, slug: e.target.value })}
      />
      <Input
        label="Date"
        name="date"
        error={errors.date}
        type="date"
        required
        value={draft.date}
        onChange={(e) => set({ ...draft, date: e.target.value })}
      />
      <Input
        label="Title"
        name="title"
        error={errors.title}
        required
        value={draft.title}
        onChange={(e) => set({ ...draft, title: e.target.value })}
      />
      <Textarea
        label="Summary"
        name="summary"
        error={errors.summary}
        required
        value={draft.summary}
        onChange={(e) => set({ ...draft, summary: e.target.value })}
      />
      <Lines
        key={`${formKey}-body`}
        label="Body"
        name="body"
        error={errors.body}
        value={draft.body}
        onChange={(body) => set({ ...draft, body })}
      />
    </>
  );
}

export const emptyPost = (): Post => ({ slug: "", date: "", title: "", summary: "", body: [] });

export function AppForm({ draft, set, formKey, media, errors }: FormProps<AppEntry>) {
  return (
    <>
      <Input
        label="Slug"
        name="slug"
        error={errors.slug}
        required
        value={draft.slug}
        onChange={(e) => set({ ...draft, slug: e.target.value })}
      />
      <Input
        label="Order"
        name="order"
        error={errors.order}
        type="number"
        required
        value={String(draft.order)}
        onChange={(e) => set({ ...draft, order: Number(e.target.value) })}
      />
      <Input
        label="Name"
        name="name"
        error={errors.name}
        required
        value={draft.name}
        onChange={(e) => set({ ...draft, name: e.target.value })}
      />
      <Input
        label="Initial"
        name="initial"
        error={errors.initial}
        required
        helper="Shown until an icon is uploaded."
        value={draft.initial}
        onChange={(e) => set({ ...draft, initial: e.target.value })}
      />
      <Input
        label="Category"
        name="category"
        error={errors.category}
        required
        value={draft.category}
        onChange={(e) => set({ ...draft, category: e.target.value })}
      />
      <Input
        label="Badge"
        name="badge"
        error={errors.badge}
        required
        value={draft.badge}
        onChange={(e) => set({ ...draft, badge: e.target.value })}
      />
      <Textarea
        label="Summary"
        name="summary"
        error={errors.summary}
        required
        value={draft.summary}
        onChange={(e) => set({ ...draft, summary: e.target.value })}
      />
      <Input
        label="Play URL"
        name="url"
        error={errors.url}
        type="url"
        required
        value={draft.url}
        onChange={(e) => set({ ...draft, url: e.target.value })}
      />
      <Lines
        key={`${formKey}-body`}
        label="Body"
        name="body"
        error={errors.body}
        value={draft.body}
        onChange={(body) => set({ ...draft, body })}
      />
      <Upload
        label="Icon"
        name="icon"
        error={errors.icon}
        prefix={`${draft.slug || "app"}-icon`}
        media={media}
        accept="image/*"
        value={draft.icon ? [draft.icon] : []}
        onChange={([icon]) => set({ ...draft, icon })}
      />
      <Upload
        label="Screens"
        name="screens"
        error={errors.screens}
        prefix={`${draft.slug || "app"}-screen`}
        media={media}
        accept="image/*"
        max={8}
        value={draft.screens ?? []}
        onChange={(screens) => set({ ...draft, screens: screens.length ? screens : undefined })}
      />
    </>
  );
}

export const emptyApp = (): AppEntry => ({
  slug: "",
  order: 1,
  name: "",
  initial: "",
  category: "",
  badge: "",
  summary: "",
  url: "",
  body: [],
});

export function PackageForm({ draft, set, formKey, errors }: FormProps<PackageEntry>) {
  return (
    <>
      <Input
        label="Slug"
        name="slug"
        error={errors.slug}
        required
        value={draft.slug}
        onChange={(e) => set({ ...draft, slug: e.target.value })}
      />
      <Input
        label="Order"
        name="order"
        error={errors.order}
        type="number"
        required
        value={String(draft.order)}
        onChange={(e) => set({ ...draft, order: Number(e.target.value) })}
      />
      <Input
        label="Name"
        name="name"
        error={errors.name}
        required
        value={draft.name}
        onChange={(e) => set({ ...draft, name: e.target.value })}
      />
      <Input
        label="Points"
        name="points"
        error={errors.points}
        type="number"
        required
        value={String(draft.points)}
        onChange={(e) => set({ ...draft, points: Number(e.target.value) })}
      />
      <Textarea
        label="Summary"
        name="summary"
        error={errors.summary}
        required
        value={draft.summary}
        onChange={(e) => set({ ...draft, summary: e.target.value })}
      />
      <Lines
        key={`${formKey}-body`}
        label="Body"
        name="body"
        error={errors.body}
        value={draft.body}
        onChange={(body) => set({ ...draft, body })}
      />
    </>
  );
}

export const emptyPackage = (): PackageEntry => ({ slug: "", order: 1, name: "", summary: "", points: 0, body: [] });
