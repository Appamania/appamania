# PRD: remove the admin, make the site static

## Problem
`/admin` (email-link sign-in, Firestore editor, Storage uploader) is more surface than a one-person
portfolio needs: auth config, ID-token parsing, upload code, write rules, and CSP holes for
identitytoolkit/securetoken. Content changes rarely and can live in the repo.

## Scope
1. Delete the admin: `app/admin/`, `components/admin/`, `lib/storage.ts` (+ test), the admin e2e
   test, `readToken`/`getDoc`/`saveDoc`/`deleteDoc` in `lib/firestore.ts`, and `ADMIN_EMAIL`,
   `isAdmin`, `NoteSchema`, `SettingsSchema` (+ types) in `lib/schemas.ts`. `/admin` returns the
   normal 404. No redirect.
2. Work, apps, packages read only from `content/snapshot.json` (zod-checked, sorted by `order`).
   Packages keep live pub.dev numbers (`lib/live.ts`).
3. `notice` and `availability` become plain strings in `config/site.ts`, empty by default,
   rendered by `app/(site)/layout.tsx` and `components/site/Footer.tsx`.
4. Firestore stays for: blog posts (server REST read, 60s ISR, per-doc zod skip via `chooseList`,
   `[]` on error or empty) and contact notes (anonymous `createNote` from the browser, with `offer`).
5. Rules: Firestore posts read-only, notes create-only (same checks), everything else denied.
   Storage `media/` read-only. CI rules job unchanged.
6. CSP: drop identitytoolkit, securetoken, and firebasestorage from `connect-src`. Keep
   firebasestorage in `img-src`/`media-src` and `images.remotePatterns`.
7. Env: drop `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `..._STORAGE_BUCKET`, `..._MESSAGING_SENDER_ID`.
8. Docs: `CLAUDE.md`, `docs/design-brief.md`, stale admin comments, privacy page copy.

## Non-goals
- No new CMS, no new backend, no Firebase SDK.
- Media schema fields (`cover`, `video`, `icon`, `screens`) and the firebasestorage host check stay.
- Callers of `getWork/getApps/getPackages/getPosts` do not change (same names, still async).
- `revalidate = 60` exports on work/apps pages stay (harmless; delete later if wanted).
- Unused `dark`/`light` themes in `styles/tokens.css` stay (contrast test covers them; separate cleanup).
- Memory file `commercial-pivot.md` is not touched.
- Nothing in Firebase console is changed by code (see user tasks).

## Acceptance checks
- `git grep -nE "isAdmin|ADMIN_EMAIL|NoteSchema|SettingsSchema|getSettings|readToken|saveDoc|deleteDoc|getDoc|lib/storage|identitytoolkit|securetoken|AUTH_DOMAIN|STORAGE_BUCKET|MESSAGING_SENDER" -- . ':!docs/plans'` returns nothing.
- `app/admin` and `components/admin` do not exist; `GET /admin` is 404 with the branded page.
- Home, /work, /work/[slug], /apps, /open-source render from the snapshot with no Firestore key set.
- /blog renders "No posts yet." when Firestore keys are missing or unreachable.
- Setting `site.notice` / `site.availability` to a non-empty string shows the banner / footer line.
- Contact form still creates a note (manual check against prod rules after deploy).
- `firestore.rules` has no `work|apps|packages|settings` match and no `isAdmin`.
- `storage.rules` `media/` is `read: true`, `write: false`.
- lint, typecheck, check:tokens, unit tests, build, and Playwright pass.

## Risks
- **Content loss on deploy.** Anything edited in Firestore work/apps/packages/settings that is not in
  `content/snapshot.json` disappears from the site the moment this ships. User must copy it into the
  snapshot (and `notice`/`availability` into `config/site.ts`) before merging to `main`.
- **Posts become console-only.** With `write: false`, new posts are written in the Firebase console
  (Admin SDK/console bypasses rules). Bad docs are skipped by zod, not rejected.
- **Rules lag.** Rules deploy only on push to `main`; until then prod still allows admin writes.
- **Privacy copy is a legal statement.** It changes from "readable from the admin page" to
  "read in the Firebase console". User must approve wording.
- **Uncommitted edit in `config/site.ts`** (GST line). The implementer must edit that file; the
  edit must not revert or silently commit the user's change (see open questions).

## User tasks (Firebase console, cannot be done from the repo)
1. Delete the junk post `posts/sdsdsdsd`.
2. Authentication > Sign-in method: disable Email link (passwordless) sign-in.
3. Copy any wanted data from `work`, `apps`, `packages`, `settings/site` into
   `content/snapshot.json` / `config/site.ts`, then optionally delete those collections.
4. Upload media in Storage `media/`, paste the download URL into the snapshot.
