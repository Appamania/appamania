import { defineConfig, devices } from "@playwright/test";

// E2E_BASE_URL runs the suite against a deployed site (no local server). E2E_PORT runs next to a dev server.
const port = Number(process.env.E2E_PORT ?? 3000);
const remote = process.env.E2E_BASE_URL;
const base = remote ?? `http://localhost:${port}`;

// CI runs `next start` on the build from the previous step.
export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  // Colour checks run with motion off, so axe does not sample a half-faded .reveal element.
  use: { baseURL: base, trace: "retain-on-failure", reducedMotion: "reduce" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: remote ? undefined : {
    command: process.env.CI ? `npm run start -- -p ${port}` : `npm run dev -- -p ${port}`,
    url: base,
    reuseExistingServer: !process.env.CI,
  },
});
