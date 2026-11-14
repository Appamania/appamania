import { expect, test } from "@playwright/test";
import { expectNoSeriousAxe } from "./helpers";

const pages = [
  "/",
  "/services",
  "/about",
  "/work",
  "/work/flutter-3-47-upgrade",
  "/apps",
  "/open-source",
  "/blog",
  "/contact",
  "/legal/privacy",
];

for (const path of pages)
  test(`${path} renders one h1 and passes axe`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expectNoSeriousAxe(page);
  });

test("home shows the audit price and the plan cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("₹2,999").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Book the audit/ }).first()).toBeVisible();
});

test("/services renders the fixed-price page", async ({ page }) => {
  const res = await page.goto("/services");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toContainText("Fixed price");
});

test("the nav has About and no Blog", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop nav is hidden under 900px");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link", { name: "About" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Blog" })).toHaveCount(0);
});

test("/about names the founder and links the audit", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText("Sumit Pal").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Book the/ }).first()).toBeVisible();
});

test("a plan card preselects the offer on the contact form", async ({ page }) => {
  await page.goto("/contact?offer=sprint");
  await expect(page.getByLabel("What do you need")).toHaveValue("sprint");
});

test("unknown route shows the branded 404", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /Route not found/ })).toBeVisible();
});

test("old URLs 301", async ({ request }) => {
  for (const [from, to] of [
    ["/studio", "/apps"],
    ["/studio/x", "/apps"],
    ["/oss/envified", "/open-source"],
    ["/legal/terms", "/"],
    ["/legal/refunds", "/"],
    ["/login", "/"],
  ]) {
    const r = await request.get(from, { maxRedirects: 0 });
    expect(r.status(), from).toBe(301);
    expect(new URL(r.headers().location!, "http://localhost").pathname).toBe(to);
  }
});

test("llms.txt, sitemap and robots are served", async ({ request }) => {
  const llms = await (await request.get("/llms.txt")).text();
  expect(llms).toContain("envified");
  expect(llms).toContain("₹2,999");
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/services");
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/work/flutter-3-47-upgrade");
  expect(await (await request.get("/robots.txt")).text()).not.toContain("Disallow: /portal");
});

test("a bad email stays on the form", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Asha");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Message").fill("Hello from the test.");
  await page.getByRole("button", { name: "Send note" }).click();
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await expect(page.getByLabel("Your name")).toHaveValue("Asha");
});

test("a honeypot note pretends to save", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Asha Rao");
  await page.getByLabel("Email").fill("asha@example.com");
  await page.getByLabel("Message").fill("Hello from the test.");
  await page.locator('input[name="website"]').fill("https://spam.example", { force: true });
  await page.getByRole("button", { name: "Send note" }).click();
  await expect(page.getByRole("status")).toContainText("Thanks — it's saved.");
});

test("/admin does not exist", async ({ page }) => {
  const res = await page.goto("/admin");
  expect(res?.status()).toBe(404);
});

test("www redirects to the apex and keeps the path", async ({ request }) => {
  test.skip(!!process.env.E2E_BASE_URL, "Needs a local server: Netlify routes by real host.");
  const res = await request.get("/services?offer=audit", { headers: { host: "www.appamania.in" }, maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers().location).toBe("https://appamania.in/services?offer=audit");
});
