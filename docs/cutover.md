# Cutover: Sam21-39/appamania → Appamania/appamania

Owner runbook after D3–D6 are green on a Vercel preview of `Appamania/appamania`.

## Confirmed

- Live today: Vercel serves **`Sam21-39/appamania`** (old).
- Target: **`Appamania/appamania`** on branch `dev` (PRD v4).
- Public email: `sumit@appamania.in` (Google Workspace).

## Old → new URL map

| Old | New | Notes |
|-----|-----|--------|
| `/` | `/` | New IA (Flutter studio) |
| `/apps` | `/apps` | Same path |
| `/apps/:id` | `/apps` | Detail pages not ported; land on grid (or add 308 later) |
| `/network` | `/apps` (Network card) or keep stub | Prefer soft land on `/apps` until waitlist module |
| `/oss/envified` | `/open-source` | Also next.config: `/oss/*` → `/open-source` |
| `/studio`, `/studio/*` | `/apps` | Already 301 in new next.config |
| Hire / contact sections | `/contact` | |
| Chai section | Footer line only | |

## Env parity checklist (you)

- [ ] Resend: SPF/DKIM/DMARC for `appamania.in`; From `hello@mail.appamania.in` (or verified), reply-to `sumit@`
- [ ] Supabase prod URL + anon + service role
- [ ] Razorpay live keys + webhook URL `https://appamania.in/api/webhooks/razorpay`
- [ ] `RAZORPAY_WEBHOOK_SECRET`, `LEAD_SALT`, Turnstile, Cloudinary
- [ ] `GOOGLE_SITE_VERIFICATION` if used
- [ ] Sentry DSN
- [ ] `NEXT_PUBLIC_AUDIT_PAGE_URL` Razorpay Payment Page

## Domain switch (you — do not automate)

1. Add `appamania.in` + `www` to **new** Vercel project (region `bom1`).
2. Remove domains from old Vercel project.
3. Confirm www → apex.
4. Submit `https://appamania.in/sitemap.xml` in Search Console.
5. Update website links: X, LinkedIn, pub.dev publisher, Play, GitHub org.

## Smoke after cutover

```bash
for p in / /services /apps /open-source /contact /work /robots.txt /sitemap.xml /opengraph-image; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://appamania.in$p")
  echo "$code $p"
done
```

- Contact form: submit test lead (Turnstile + Resend).
- Portal login smoke with seed-like admin (prod MFA).
- No spike of 404s in Vercel logs for 48h.

## Archive old repo (you)

Add README pointer to `https://github.com/Appamania/appamania`, then archive `Sam21-39/appamania` on GitHub.
