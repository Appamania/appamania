# Guidelines: remove the admin

Branch `dev`. Do not touch `.codex/` or `app/(site)/services/page.tsx`. `config/site.ts` has an
uncommitted user edit (`billing:` line): edit around it, never revert it, and follow the user's
answer on how to commit it. Do not touch the memory file `commercial-pivot.md`.

## Step 1. Delete
```
git rm -r app/admin components/admin lib/storage.ts lib/storage.test.ts
```
Callers of the deleted code (all inside the deleted folders, verified by grep):
`DocEditor`, `Notes`, `SiteSettings` used `listDocs/getDoc/saveDoc/deleteDoc`; `SignIn` used
`readToken`, `isAdmin`; `Notes` used `NoteSchema`; `SiteSettings` used `SettingsSchema`;
`Fields` used `uploadFile` from `lib/storage`. No site code imports any of these.

## Step 2. `lib/schemas.ts`
- Delete `ADMIN_EMAIL`, `isAdmin`, `NoteSchema`, `type Note`, `SettingsSchema`, `type Settings`.
- Keep `media`, all four content schemas, `chooseList`. Reword the `media` comment:
  "Uploaded in the Firebase console to Storage `media/`. Only that host renders, so a bad row
  cannot point next/image elsewhere."

`lib/schemas.test.ts`: keep the `chooseList` test; delete the note, settings, and admin tests; drop
those imports. Add one case so the host check cannot silently go:
`expect(WorkSchema.shape.cover.safeParse("https://evil.example/a.png").success).toBe(false)`.

## Step 3. `lib/firestore.ts`
- Header comment: "ships to the browser for the note form".
- Delete `readToken`, `getDoc`, `saveDoc`, `deleteDoc`, `readInit`.
- `listDocs(project, key, collection)`: drop the `token` param; fetch with `{ next: { revalidate: 60 } }`.
- Keep `encodeValue`, `decodeValue`, `encodeFields`, `decodeFields`, `createNote` unchanged.

`lib/firestore.test.ts`: delete the `readToken` test and import.

## Step 4. `lib/content.ts`
Keep exports `getWork`, `getApps`, `getPackages`, `getPosts`, `LivePackage`, and types
`AppEntry, PackageEntry, Post, Work` (drop `Settings`, `getSettings`, `getDoc`, `SettingsSchema`).
- `checked(name: "work" | "apps" | "packages", schema)` stays as is (snapshot + zod, throws on bad file).
- `getWork()` / `getApps()`: `async`, return `byOrder(checked(...))`. No Firestore.
- `getPackages()`: rows = `byOrder(checked("packages", PackageSchema))`, then the existing
  `fetchPubScore` merge unchanged.
- `getPosts()`: replace `load` with
  ```ts
  const k = keys();
  if (!k) return [];
  try {
    const docs = await listDocs(k.project, k.key, "posts");
    return byDate(chooseList(docs.map((d) => ({ slug: d.id, ...d.fields })), PostSchema, []));
  } catch {
    return [];
  }
  ```
- Delete `load`. Keep `keys`, `byOrder`, `byDate`.
- Leave `"posts": []` in `content/snapshot.json`; nothing reads it.

Callers that must compile unchanged: `app/(site)/page.tsx`, `work/page.tsx`, `work/[slug]/page.tsx`,
`apps/page.tsx`, `apps/[slug]/page.tsx`, `open-source/page.tsx`, `open-source/[slug]/page.tsx`,
`blog/page.tsx`, `blog/[slug]/page.tsx`, `app/llms.txt/route.ts`, `app/sitemap.ts`.

## Step 5. Notice and availability
- `config/site.ts`: add to `site`, above `links`:
  ```ts
  /** Banner above the nav. Empty hides it. */
  notice: "" as string,
  /** Footer line, e.g. "Taking one sprint from January". Empty hides it. */
  availability: "" as string,
  ```
  (`as string` so `as const` does not narrow to `""`.)
- `app/(site)/layout.tsx`: remove `getSettings` import and call; make it a plain (non-async)
  function; import `site` from `@/config/site`; render `site.notice`; pass nothing to `<Footer />`.
- `components/site/Footer.tsx`: drop the `availability` prop; read `site.availability` (already
  imports `site`). `app/not-found.tsx` already renders `<Footer />` with no props.

## Step 6. Rules
`firestore.rules`: delete `isAdmin()` and the `work`, `apps`, `packages`, `settings` matches.
- `posts/{id}`: `allow read: if true; allow write: if false;`
- `notes/{id}`: keep the `create` condition byte-for-byte; replace the rest with
  `allow read, update, delete: if false;`
- Keep `capped()` and the `/{document=**}` deny.

`storage.rules`: delete `isAdmin()`; `media/{file}`: `allow read: if true; allow write: if false;`
with comment "Public read. Uploads go through the Firebase console, which bypasses rules." Keep the
catch-all deny. `firebase.json` and the CI `rules` job stay unchanged.

## Step 7. CSP and env
- `next.config.ts` `connect-src`: remove `https://identitytoolkit.googleapis.com`,
  `https://securetoken.googleapis.com`, `https://firebasestorage.googleapis.com`. Keep
  `https://firestore.googleapis.com`. Leave `img-src`, `media-src`, `images.remotePatterns`.
- `apphosting.yaml`: delete the `AUTH_DOMAIN`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID` entries.
- `.env.example`: delete the same three lines; line 1 becomes
  `# Firebase web app (Firestore REST for posts and notes). No sign-in.`

## Step 8. Copy, comments, docs
- `app/(site)/legal/privacy/page.tsx` (pending user approval of wording; bump `updated`):
  "Those fields are stored in Firestore and are read only by {site.email} in the Firebase console.
  They are used only to reply. Page views use Firebase Analytics." (drop the Auth session sentence)
- `components/site/Analytics.tsx` comment: "No Firebase SDK: the note form and blog talk REST, …".
- `styles/tokens.css` line 2: drop "and admin".
- `.claude/agents/design-reviewer.md` line 11: drop "portal/admin dark/light".
- `CLAUDE.md` line 4: "Notes from the contact form go to Firestore; blog posts are read from
  Firestore. Case studies, apps, and packages live in `content/snapshot.json`."
  Architecture bullet: "Site constants, notice, and availability only in `config/site.ts`. Work,
  apps, and packages come from `content/snapshot.json` through `lib/content.ts`. Blog posts are read
  from Firestore over REST (`lib/firestore.ts`), empty when unreachable. Notes are created
  anonymously and read in the Firebase console. No Firebase SDK in the browser. Media is uploaded in
  the Firebase console to Storage `media/`; only that host renders through `next/image`."
  Prices bullet stays.
- `docs/design-brief.md`: delete the `**Admin:**` art-direction line (18), the "Admin — variance…"
  half of the dials line (19-20, keep the site dial), the "Admin: table list…" layout line (41),
  the `?tab=`/`?id=` part of line 89 (keep `?offer=` on contact), line 90 (unsaved edits), "and the
  admin save bar" on line 93. Line 63: "Uploaded media comes from Firebase Storage (uploaded in the
  Firebase console, URL pasted into `content/snapshot.json`): …".

## Step 9. E2E
`tests/e2e/site.spec.ts`: replace the admin test with
```ts
test("/admin does not exist", async ({ page }) => {
  const res = await page.goto("/admin");
  expect(res?.status()).toBe(404);
});
```
`app/robots.ts` and `app/sitemap.ts` never mention `/admin`: no change.

## Step 10. Verify
```
git grep -nE "isAdmin|ADMIN_EMAIL|NoteSchema|SettingsSchema|getSettings|readToken|saveDoc|deleteDoc|getDoc|lib/storage|identitytoolkit|securetoken|AUTH_DOMAIN|STORAGE_BUCKET|MESSAGING_SENDER" -- . ':!docs/plans'
npm run lint && npm run typecheck
npm run check:tokens
npm test
npm run build
CI=true E2E_PORT=3111 npx playwright test
```
Then run the `design-reviewer` subagent on layout/Footer.

## Commits (suggested)
1. `feat!: remove the admin and serve work, apps, packages from the snapshot` (steps 1-7, 9;
   step 2 cannot build before step 1, so they share a commit)
2. `docs: drop admin from CLAUDE.md, brief, and privacy` (step 8)

## Decisions recorded before implementation
- The uncommitted GST edits in config/site.ts and app/(site)/services/page.tsx ship inside this change. Keep them.
- Privacy page wording is approved as planned. Update the date.
- Do not commit, push, or open a PR. Leave all changes in the working tree on dev.
- Leave the untracked .codex/ folder alone.
- Copying old Firestore work/apps/packages data into content/snapshot.json is the user's task, not yours.
