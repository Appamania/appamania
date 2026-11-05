import { expect, test, type Page } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { adminDb, expectNoSeriousAxe } from "./helpers";

// PRD E1, E2.1–E2.3. Night theme pages, lead intake.
const pages = ["/", "/services", "/work", "/work/flutter-3-47-upgrade", "/apps", "/open-source", "/contact", "/legal/terms", "/legal/refunds", "/legal/privacy"];

for (const path of pages)
  test(`${path} renders one h1 and passes axe`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expectNoSeriousAxe(page);
  });

test("prices come from config (₹2,999 / ₹24,999 / ₹14,999)", async ({ page }) => {
  await page.goto("/services");
  for (const p of ["₹2,999", "₹24,999", "₹14,999", "from ₹74,999", "from ₹14,999"])
    await expect(page.getByText(p, { exact: false }).first()).toBeVisible();
});

test("unknown route shows the branded 404", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /Route not found/ })).toBeVisible();
});

test("old URLs 301 to their new homes (E1.8)", async ({ request }) => {
  for (const [from, to] of [["/studio", "/apps"], ["/studio/x", "/apps"], ["/oss/envified", "/open-source"]]) {
    const r = await request.get(from, { maxRedirects: 0 });
    expect(r.status(), from).toBe(301);
    expect(r.headers().location).toContain(to);
  }
});

test("llms.txt, sitemap and robots are served (E1.11)", async ({ request }) => {
  expect(await (await request.get("/llms.txt")).text()).toContain("₹2,999");
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/work/flutter-3-47-upgrade");
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /portal");
});

// ---------- lead form ----------
const freshIp = (page: Page) => page.setExtraHTTPHeaders({ "x-forwarded-for": `10.${[...randomBytes(3)].join(".")}` });
const uniqueEmail = () => `e2e-${randomBytes(4).toString("hex")}@example.com`;

async function fill(page: Page, email: string, extra?: (p: Page) => Promise<void>) {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Asha Rao");
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Industry").selectOption("Health");
  await page.getByLabel(/What does the app do/).fill("Our booking app crashes on Android 15 at checkout.");
  await extra?.(page);
  // Turnstile test key passes automatically once the widget has loaded.
  await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(/.+/, { timeout: 15_000 });
  await page.getByRole("button", { name: "Send enquiry" }).click();
}

test("enquiry is stored as a new lead and confirmed (E2.1)", async ({ page }) => {
  await freshIp(page);
  const email = uniqueEmail();
  await fill(page, email);
  await expect(page.getByRole("status")).toContainText("Thanks — it's in.");
  const { data } = await adminDb().from("leads").select("stage, need, industry, conflict_flag, ip_hash").eq("email", email).single();
  expect(data).toMatchObject({ stage: "new", need: "audit", industry: "Health", conflict_flag: false });
  expect(data?.ip_hash).toMatch(/^[0-9a-f]{64}$/);
});

test("invalid input shows field errors and keeps values", async ({ page }) => {
  await freshIp(page);
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Asha");
  await page.getByLabel("Work email").fill("not-an-email");
  await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(/.+/, { timeout: 15_000 });
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await expect(page.getByText("Choose an industry")).toBeVisible();
  await expect(page.getByLabel("Your name")).toHaveValue("Asha");
});

test("honeypot submissions pretend success and store nothing", async ({ page }) => {
  await freshIp(page);
  const email = uniqueEmail();
  await fill(page, email, (p) => p.locator('input[name="website"]').fill("https://spam.example", { force: true }));
  await expect(page.getByRole("status")).toBeVisible();
  const { count } = await adminDb().from("leads").select("id", { count: "exact", head: true }).eq("email", email);
  expect(count).toBe(0);
});

test("same email twice within 10 minutes is refused", async ({ page }) => {
  await freshIp(page);
  const email = uniqueEmail();
  await fill(page, email);
  await expect(page.getByRole("status")).toBeVisible();
  await fill(page, email);
  await expect(page.getByRole("alert").filter({ hasText: "Got it already" })).toBeVisible();
});
