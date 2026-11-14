# PRD: static content, one Firestore write

Branch `feat/static-notes-only`, cut from `fix/rules-deploy-and-www` (PR #10). Plan only, nothing committed.

## Problem

The admin is gone, but the site still has two Firebase backend paths:

- Blog posts are read from Firestore (`getPosts` -> `listDocs` in `lib/firestore.ts`) through REST reads, the `posts` rules block, and decode helpers.
- Media is expected on Firebase Storage: the `media` validator in `lib/schemas.ts`, `storage.rules`, the `storage` entry in `firebase.json`, the Storage deploy step in CI, and `firebasestorage.googleapis.com` in the CSP and `images.remotePatterns`.

No content uses either path today. `content/snapshot.json` has `posts: []` and no `firebasestorage` URL. Both paths are dead weight that still needs deploys, rules, and console setup.

## Goal

All content is static and lives in the repo (`content/snapshot.json`, media in `public/media/`). Firestore is used for one thing only: the browser creates a `notes` document anonymously over REST from the contact form. Nothing reads Firestore.

## Scope

1. `getPosts` reads `content/snapshot.json` `posts`, validated with `PostSchema`, sorted by date descending. The snapshot `posts` stays `[]`.
2. Delete `listDocs`, `decodeValue`, `decodeFields`, the `Listed` type, `keys()` in `lib/content.ts`, `chooseList` in `lib/schemas.ts`, and their tests. Keep `encodeValue`, `encodeFields`, `createNote`, and `projectUrl`, which `createNote` uses.
3. Remove Storage: delete `storage.rules`, drop `storage` from `firebase.json`, drop the Storage deploy step from CI, and remove `firebasestorage.googleapis.com` from `next.config.ts` (CSP `img-src`, `media-src`, and the whole `images` key).
4. The `media` validator accepts local paths only: it must start with `/media/` and contain no `..` and no `//`. The fields stay the same: `cover`, `video`, `icon`, `screens`. Create `public/media/.gitkeep`.
5. `firestore.rules` keeps `capped()`, the `notes` match (create-only, byte-for-byte), and the catch-all deny. Only the `posts` match is removed.
6. Docs: CLAUDE.md (intro line and architecture bullet) and the Imagery bullet in `docs/design-brief.md`. Stale code comments that mention Storage or blog REST: `WorkCards.tsx`, `AppCard.tsx`, `Analytics.tsx`.

## Non-goals

- No hosting change. App Hosting, `apphosting.yaml`, and every `revalidate` value stay as they are. The `revalidate = 60` on the blog pages becomes a no-op for posts, but the user asked to keep it.
- No env var changes.
- No change to the note form, `lib/note.ts`, `createNote`, the `notes` rule, or the `firestore.googleapis.com` entry in `connect-src`.
- No real posts or media are added.
- `docs/plans/remove-admin/` is history and stays untouched. Memory files are not edited. `.codex/` is not touched.
- No change to the privacy page copy (see the open questions).

## Acceptance checks

- `grep -rnE "listDocs|decodeValue|decodeFields|chooseList|firebasestorage|storage\.rules" app components lib config tests next.config.ts firebase.json .github CLAUDE.md docs/design-brief.md` prints nothing.
- `storage.rules` is gone, and `firebase.json` is `{ "firestore": { "rules": "firestore.rules" } }`.
- `firestore.rules` has no `posts` match. The `notes` block and `capped()` match the old text exactly (check with `git diff`: only lines removed).
- The CI `rules` job has the secrets guard and one deploy step, `--only firestore:rules`.
- `next.config.ts` has no `images` key. CSP `img-src` and `media-src` list no Storage host. `connect-src` still lists `https://firestore.googleapis.com`.
- Unit tests: the media rule accepts `/media/a.png` and rejects `https://evil.example/a.png`, `/media/../x`, and `//evil.example/a.png`. `encodeFields` drops `undefined` and encodes strings and integers.
- `/blog` renders "No posts yet." with `posts: []`. If you add a valid post to the snapshot locally (do not commit it), it appears, and two posts sort newest first.
- `npm run lint`, `npm run typecheck`, `npm run check:tokens`, `npm test`, `npm run build`, and `CI=true E2E_PORT=3111 npx playwright test` all pass.
- The contact form still POSTs to `firestore.googleapis.com/.../notes`. Check it in the browser network tab against the real project once.

## Firebase console tasks (manual, owner)

1. Optional: delete the `posts`, `work`, `apps`, `packages`, and `settings` collections in Firestore. Nothing reads them. Keep `notes`.
2. Do not enable Storage. If a bucket already exists, it can stay or be deleted. The repo no longer deploys to it, and no snapshot row points at it.
3. The CI rules deploy (`firebase deploy --only firestore:rules`) needs only the Cloud Firestore API (plus the Firebase Rules API that it uses) and the existing `FIREBASE_SERVICE_ACCOUNT`. The Storage permissions that service account was given can be removed.
4. After the merge to `main`, check in Firestore > Rules that the published rules have no `posts` block.

## Risks

- **Merge order with PR #10.** This branch is cut from `fix/rules-deploy-and-www`, which adds the split Storage step. Merge PR #10 first, or retarget this PR, so the Storage step does not come back.
- **The deployed rules lag the repo** until CI runs on `main`. Until then, live rules still allow public `posts` reads. The risk is low: the collection is empty or about to be deleted.
- **A JSON import of `posts: []` is typed as `never[]`.** `checked()` passes it to `safeParse` as unknown, so typecheck is fine. A future first post just works.
- **Local `next/image`** needs no config for plain paths. A query string on a local src would need `images.localPatterns`, and the `/media/` rule does not forbid `?`. That is acceptable for repo-controlled content.
- **`public/media/.gitkeep` is served** at `/media/.gitkeep` as an empty file. Harmless.

## Open questions (not blocking)

1. Privacy page accuracy. It says the form collects "name, email, a message, and an optional link". The note also stores the "What do you need" offer choice and a `received` timestamp. It also says page views use "Firebase Analytics", but the site loads GA4 through gtag.js (`components/site/Analytics.tsx`). Per instruction the copy stays. Do you want a one-line fix (add "the service you picked", "Google Analytics")?
2. `docs/status.md` is stale. It describes Vercel Hobby, `/admin`, Remote Config, and Firestore reads, and is not in this task's list. Should it be deleted, rewritten, or left alone?
3. Should the `media` rule also be a character whitelist (`^/media/[\w./-]+$`)? It would block spaces and query strings. The plan uses only the stated rule.
