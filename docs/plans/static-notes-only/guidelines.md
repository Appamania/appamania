# Guidelines: static content, one Firestore write

See `prd.md` for scope. All paths are relative to `/Users/sp/Dev/Appamania/appamania`. Do not touch `.codex/` or `docs/plans/remove-admin/`, and do not commit.

## Caller map (grep run on this branch)

| Symbol | Defined | Callers outside its own file | Action |
|---|---|---|---|
| `listDocs` | `lib/firestore.ts` | `lib/content.ts` (`getPosts`) | delete |
| `decodeValue` | `lib/firestore.ts` | `lib/firestore.test.ts` | delete |
| `decodeFields` | `lib/firestore.ts` | none (used only by `listDocs`) | delete |
| `Listed` type | `lib/firestore.ts` | none | delete |
| `keys()` | `lib/content.ts` (private) | none (used only by `getPosts`) | delete |
| `chooseList` | `lib/schemas.ts` | `lib/content.ts`, `lib/schemas.test.ts` | delete |
| `encodeValue`, `encodeFields`, `projectUrl`, `createNote` | `lib/firestore.ts` | `components/site/NoteForm.tsx` (`createNote`) | keep |
| `getPosts` | `lib/content.ts` | `app/sitemap.ts`, `app/llms.txt/route.ts`, `app/(site)/blog/page.tsx`, `app/(site)/blog/[slug]/page.tsx` | keep the async signature, so callers do not change |
| `firebasestorage` | `next.config.ts`, `lib/schemas.ts` | none in `content/` | remove |

Grep again before deleting:

```sh
grep -rnE "listDocs|decodeValue|decodeFields|chooseList|keys\(\)|getPosts|firebasestorage|storage\.rules|Storage" app components lib config tests content scripts next.config.ts firebase.json .github CLAUDE.md AGENTS.md docs/design-brief.md
```

## Step order

### 1. `lib/schemas.ts`
- Replace `media` and its doc comment:
  ```ts
  /** Repo file under public/media/. Local paths only, so a bad row cannot point next/image or <video> elsewhere. */
  const media = z.string().startsWith("/media/").refine((s) => !s.includes("..") && !s.includes("//"));
  ```
- Delete `chooseList` and its doc comment (the last function in the file).
- `cover`, `video`, `icon`, and `screens` stay as they are.

### 2. `lib/schemas.test.ts`
- Remove the `chooseList` import and the "skips a bad document…" test.
- Replace the Storage-host test:
  ```ts
  it("accepts media only from /media/", () => {
    const cover = WorkSchema.shape.cover;
    expect(cover.safeParse("/media/a.png").success).toBe(true);
    for (const bad of ["https://evil.example/a.png", "/media/../x", "//evil.example/a.png"])
      expect(cover.safeParse(bad).success).toBe(false);
  });
  ```

### 3. `lib/content.ts`
- Remove the `listDocs` import and `chooseList` from the schemas import. Delete `keys()`.
- Widen `checked`: `name: "work" | "apps" | "packages" | "posts"`.
- Replace `getPosts` (keep it `async`, since 4 callers await it):
  ```ts
  /** Blog posts from content/snapshot.json, newest first. */
  export async function getPosts() {
    return byDate(checked("posts", PostSchema));
  }
  ```
- Keep `byDate`. Its string compare is correct for ISO `YYYY-MM-DD` dates.

### 4. `lib/firestore.ts`
- Delete `decodeValue`, `decodeFields`, the `Listed` type, and `listDocs`.
- Keep `FsValue`, `encodeValue`, `encodeFields`, `projectUrl`, and `createNote` unchanged.
- The header comment stays accurate: "ships to the browser for the note form".

### 5. `lib/firestore.test.ts`
Replace the round-trip test, which imports `decodeValue`, with an `encodeFields` test:
```ts
import { encodeFields } from "./firestore";
it("encodes note fields and drops undefined", () => {
  expect(encodeFields({ name: "a", n: 1, skip: undefined })).toEqual({
    name: { stringValue: "a" },
    n: { integerValue: "1" },
  });
});
```

### 6. `next.config.ts`
- `img-src`: `"img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com"`
- `media-src`: `"media-src 'self'"`
- Delete the `images: { remotePatterns: [...] },` line. Nothing else is under `images`.
- Keep `https://firestore.googleapis.com` in `connect-src`, since the note form needs it. There is no Storage host in `connect-src`.

### 7. Storage files
- `git rm storage.rules`
- `firebase.json` becomes:
  ```json
  {
    "firestore": { "rules": "firestore.rules" }
  }
  ```
- Create `public/media/.gitkeep` (empty). The `public/` folder does not exist yet, so this creates it.

### 8. `firestore.rules`
- Delete the 5 lines from `// Blog posts are written in the Firebase console…` through the closing `}` of `match /posts/{id}`.
- Do not edit `capped()`, the `notes` block, or the catch-all. Afterwards, `git diff firestore.rules` must show only `-` lines.

### 9. `.github/workflows/ci.yml` (`rules` job)
- The comment on line 25 becomes `# Firestore rules deploy from the repo, so the console never drifts. App Hosting rolls out main on its own.`
- Delete the `# Two steps so a Storage problem…` comment and the whole `deploy --only storage` step (the `run` line and its `env` block).
- Keep the secrets guard step and the `deploy --only firestore:rules` step unchanged.

### 10. Components and pages that render media: no logic change
- `components/site/WorkCards.tsx`, `components/site/AppCard.tsx`, `app/(site)/work/[slug]/page.tsx`, and `app/(site)/apps/[slug]/page.tsx` already pass `width`/`height`/`sizes` to `next/image`. A local `/media/...` src needs no `remotePatterns`, and the optimizer reads from `public/`. `<video src>`/`poster` on the work page loads from `'self'`, which `media-src 'self'` and `img-src 'self'` allow.
- Comment-only edits:
  - `WorkCards.tsx` line 6: `Cover from Storage when uploaded` -> `Cover from public/media when set`.
  - `AppCard.tsx` line 6: `Icon from Storage when uploaded` -> `Icon from public/media when set`.
  - `components/site/Analytics.tsx` line 3: `the note form and blog talk REST` -> `the note form talks REST`.
- No change to the blog pages, `app/sitemap.ts`, or `app/llms.txt/route.ts`. `revalidate` values stay.

### 11. `tests/e2e/site.spec.ts`
No change. `/blog` is already in the route list and renders "No posts yet." when posts are empty, which is what CI saw without Firebase env. The e2e suite has no Firestore or Storage mocks to remove. Optional: when a real post lands, the existing route sweep covers `/blog`. Add a `/blog/<slug>` check then, not now.

### 12. Docs
- `CLAUDE.md` line 4: `Notes from the contact form go to Firestore. All other content is static in the repo.`
- `CLAUDE.md` architecture bullet (line 27) becomes:
  `- Site constants, notice, and availability only in config/site.ts. Work, posts, apps, and packages are static, read from content/snapshot.json through lib/content.ts. Firestore is used only for contact notes: the browser creates them anonymously over REST (lib/firestore.ts), and they are read in the Firebase console. Nothing reads Firestore. No Firebase SDK in the browser, no Firebase Storage. Media is committed to public/media/ and referenced as /media/... paths.`
  (Keep the file's backtick style for paths.)
- `docs/design-brief.md` Imagery bullet (lines 60-62) becomes:
  `- Media is committed to the repo in public/media/ and referenced from content/snapshot.json as /media/... paths: case-study cover (16:10) or mp4, app icon (square), app screenshots (9:19.5). Sized next/image, never a bare <img> on the site.`
- Privacy page (`app/(site)/legal/privacy/page.tsx`): no edit. It is still accurate on storage: notes are in Firestore and read in the console. Two wording gaps go to the user (PRD open question 1).
- Leave `docs/status.md` as it is until the user answers PRD open question 2.

## Verify

```sh
cd /Users/sp/Dev/Appamania/appamania
npm run lint
npm run typecheck
npm run check:tokens
npm test
npm run build
CI=true E2E_PORT=3111 npx playwright test
grep -rnE "listDocs|decodeValue|decodeFields|chooseList|firebasestorage|storage\.rules" app components lib config tests next.config.ts firebase.json .github CLAUDE.md docs/design-brief.md   # expect no output
git diff firestore.rules   # only removed lines
git status --short         # .codex/ still untracked and untouched; storage.rules deleted; public/media/.gitkeep added
```

Manual check: `npm run dev`, then send a test note from `/contact` and confirm a `200` POST to `firestore.googleapis.com/v1/projects/<project>/databases/(default)/documents/notes`. Delete the test note in the console afterwards.

Suggested commits: `refactor(content)!: read posts from the snapshot and drop Firestore reads`, `chore(firebase): remove Storage`, `docs: static content and notes-only Firestore`.

## Decisions recorded before implementation
- Privacy page: make the one-line accuracy fixes. State that a note stores the name, email, message, optional link, the chosen offer, and a received timestamp. Say page analytics use Google Analytics (GA4), not "Firebase Analytics". Bump the `updated` date to 14 Nov 2026. Change nothing else on the page.
- docs/status.md is gitignored local notes. Do not touch it.
- Media rule is stricter than the plan text: `z.string().regex(/^\/media\/[A-Za-z0-9._\/-]+$/).refine((s) => !s.includes("..") && !s.includes("//"))`. Schema test cases: accepts "/media/a.png" and "/media/work/cover-1.webp"; rejects "https://evil.example/a.png", "/media/../x", "//evil.example/a.png", "/media/a b.png", "/media/a.png?x=1".
- Do not commit, push, or open a PR. Leave changes in the working tree on feat/static-notes-only. Leave the untracked .codex/ folder alone.
