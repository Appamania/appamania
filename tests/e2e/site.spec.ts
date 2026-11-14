import { expect, test } from "@playwright/test";
import { expectNoSeriousAxe } from "./helpers";

const pages = [
  "/",
  "/services",
  "/about",
  "/services/flutter-upgrade",
  "/services/flutter-app-rescue",
  "/services/flutter-app-audit",
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

test("the home h1 names the problem and the proof strip links four facts", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Stuck Flutter app");
  await expect(page.locator("dl a")).toHaveCount(4);
});

test("a case study shows breadcrumbs", async ({ page }) => {
  await page.goto("/work/flutter-3-47-upgrade");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
});

test("/contact says what happens next", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByText("What happens next")).toBeVisible();
});

test("an unknown service page is a 404", async ({ page }) => {
  const res = await page.goto("/services/nope");
  expect(res?.status()).toBe(404);
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

test("/contact asks for platform, timeline, and budget", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByLabel("Platform (optional)")).toBeVisible();
  await expect(page.getByLabel("Timeline (optional)")).toBeVisible();
  await expect(page.getByLabel("Budget (optional)")).toBeVisible();
  await expect(page.getByLabel("Budget (optional)").locator("option", { hasText: "Not sure yet" })).toHaveCount(1);
});

test("a CTA click sends cta_click to gtag", async ({ page }) => {
  // Stub gtag before any page script runs. Non-writable and non-configurable, so GA's own script cannot replace it. sessionStorage keeps the events across the navigation.
  await page.addInitScript(() => {
    Object.defineProperty(window, "gtag", {
      value: (...args: unknown[]) => {
        const list = JSON.parse(sessionStorage.getItem("ev") ?? "[]");
        list.push(args);
        sessionStorage.setItem("ev", JSON.stringify(list));
      },
      writable: false,
      configurable: false,
    });
  });
  await page.goto("/");
  await page.locator('a[data-cta="hero_primary"]').click();
  await page.waitForURL(/\/contact/);
  const events = await page.evaluate(() => JSON.parse(sessionStorage.getItem("ev") ?? "[]"));
  expect(events).toContainEqual(["event", "cta_click", expect.objectContaining({ cta_id: "hero_primary" })]);
});

test("a honeypot note pretends to save", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Asha Rao");
  await page.getByLabel("Email").fill("asha@example.com");
  await page.getByLabel("Message").fill("Hello from the test.");
  await page.locator('input[name="website"]').fill("https://spam.example", { force: true });
  await page.getByRole("button", { name: "Send note" }).click();
  await expect(page.getByRole("status")).toContainText("Thanks. Your note is in.");
});

test("/services/flutter-upgrade has one h1 and breadcrumbs", async ({ page }) => {
  await page.goto("/services/flutter-upgrade");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();
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

test("sitemap lists about and a landing page, and no blog while posts are empty", async ({ request }) => {
  const body = await (await request.get("/sitemap.xml")).text();
  expect(body).toContain("/about");
  expect(body).toContain("/services/flutter-upgrade");
  expect(body).not.toContain("/blog</loc>");
});

test("/blog is noindex while posts are empty", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("the case study Article JSON-LD has no undefined, NaN, or datePublished", async ({ page }) => {
  await page.goto("/work/flutter-3-47-upgrade");
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
  expect(ld).toContain('"@type":"Article"');
  expect(ld).not.toContain("undefined");
  expect(ld).not.toContain("NaN");
  expect(ld).not.toContain("datePublished");
});

test("an app page has SoftwareApplication JSON-LD", async ({ page }) => {
  await page.goto("/apps/medify");
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
  expect(ld).toContain("SoftwareApplication");
});

test("llms.txt links the three service pages", async ({ request }) => {
  const body = await (await request.get("/llms.txt")).text();
  for (const slug of ["flutter-upgrade", "flutter-app-rescue", "flutter-app-audit"])
    expect(body).toContain(`/services/${slug}`);
});

test("llms.txt names the studio and the audit price", async ({ request }) => {
  const body = await (await request.get("/llms.txt")).text();
  expect(body).toContain("Flutter rescue studio");
  expect(body).toContain("₹2,999");
});

test("home has Organization and FAQPage structured data", async ({ page }) => {
  await page.goto("/");
  const html = await page.content();
  expect(html).toContain('"@type":"Organization"');
  expect(html).toContain('"@type":"FAQPage"');
});

test("a case study has BreadcrumbList structured data", async ({ page }) => {
  await page.goto("/work/flutter-3-47-upgrade");
  expect(await page.content()).toContain('"@type":"BreadcrumbList"');
});
