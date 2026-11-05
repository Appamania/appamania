import { expect, test } from "@playwright/test";
import { createHmac } from "node:crypto";
import { adminDb, expectNoSeriousAxe, signIn } from "./helpers";

// Seeded users (supabase/seed.sql). PRD E3.1–E3.3, E4.7.

test("signed-out visitors are sent to sign-in from portal and admin", async ({ page }) => {
  await page.goto("/portal");
  await expect(page).toHaveURL(/\/portal\/login$/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/portal\/login$/);
});

test("sign-in page has no sign-up path and passes axe (E3.1)", async ({ page }) => {
  await page.goto("/portal/login");
  await expect(page.getByRole("heading", { name: "Sign in to your portal" })).toBeVisible();
  await expect(page.getByText(/sign up|create account|register/i)).toHaveCount(0);
  await expectNoSeriousAxe(page);
});

test("magic link for an unknown email never creates an account (E3.1)", async ({ page }) => {
  const email = `nobody-${Date.now()}@example.com`;
  await page.goto("/portal/login");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Email me a sign-in link" }).click();
  await expect(page.getByRole("status")).toContainText("If that email has portal access");
  const { data } = await adminDb().auth.admin.listUsers({ perPage: 1000 });
  expect(data.users.some((u) => u.email === email)).toBe(false);
});

test("client sees only own project and cannot reach admin (E3.2, E4.7)", async ({ page }) => {
  await signIn(page, "ana@clienta.test");
  await expect(page).toHaveURL(/\/portal$/);
  await expect(page.getByRole("heading", { name: "Clinic app rescue sprint" })).toBeVisible();
  await expect(page.getByText("Game app health audit")).toHaveCount(0);
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
  await expectNoSeriousAxe(page);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/portal$/);
});

test("portal theme toggle persists without flash (E4.8)", async ({ page }) => {
  await signIn(page, "ben@clientb.test");
  const shell = page.locator("#app-theme");
  await expect(shell).toHaveAttribute("data-theme", "dark");
  // Retry the click until hydration has attached the handler.
  await expect(async () => {
    await page.getByRole("button", { name: "Switch light or dark theme" }).filter({ visible: true }).click();
    await expect(shell).toHaveAttribute("data-theme", "light", { timeout: 500 });
  }).toPass();
  await page.reload();
  await expect(shell).toHaveAttribute("data-theme", "light");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#F6F2EA");
  await expectNoSeriousAxe(page);
});

/** RFC 6238 TOTP (SHA-1, 30 s, 6 digits) from a base32 secret. */
function totp(secret: string, now = Date.now()) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const bits = secret
    .replace(/=+$/, "")
    .toUpperCase()
    .split("")
    .map((c) => alphabet.indexOf(c).toString(2).padStart(5, "0"))
    .join("");
  const key = Buffer.from(bits.match(/.{8}/g)!.map((b) => parseInt(b, 2)));
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(now / 30000)));
  const h = createHmac("sha1", key).update(counter).digest();
  const o = h[h.length - 1] & 0xf;
  return String((h.readUInt32BE(o) & 0x7fffffff) % 1_000_000).padStart(6, "0");
}

test("admin must pass TOTP before admin pages (E3.3)", async ({ page }) => {
  const db = adminDb();
  const id = "00000000-0000-0000-0000-00000000000a";
  const { data } = await db.auth.admin.mfa.listFactors({ userId: id });
  for (const f of data?.factors ?? []) await db.auth.admin.mfa.deleteFactor({ userId: id, id: f.id });

  await signIn(page, "admin@appamania.test");
  await expect(page).toHaveURL(/\/portal\/login\/mfa$/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/portal\/login\/mfa$/);

  const secret = await page.locator("code").innerText();
  await page.getByLabel("6-digit code").fill(totp(secret));
  await page.getByRole("button", { name: "Verify" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByText("Clients", { exact: true })).toBeVisible();
  await expectNoSeriousAxe(page);
});
