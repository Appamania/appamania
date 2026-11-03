import { defineConfig, devices } from "@playwright/test";

// E2E_PORT lets e2e run next to a dev server on 3000.
const port = Number(process.env.E2E_PORT ?? 3000);
const base = `http://localhost:${port}`;

// PRD v4 §23: e2e against the local stack. One worker: tests share seeded rows (admin TOTP factor). CI runs `next start` on the build from the previous step.
export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: base, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: process.env.CI ? `npm run start -- -p ${port}` : `npm run dev -- -p ${port}`,
    url: `${base}/portal/login`,
    reuseExistingServer: !process.env.CI,
  },
});
