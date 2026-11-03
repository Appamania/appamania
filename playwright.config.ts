import { defineConfig, devices } from "@playwright/test";

// PRD v4 §23: e2e against the local stack. One worker: tests share seeded rows (admin TOTP factor). CI runs `next start` on the build from the previous step.
export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://localhost:3000", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: "http://localhost:3000/portal/login",
    reuseExistingServer: !process.env.CI,
  },
});
