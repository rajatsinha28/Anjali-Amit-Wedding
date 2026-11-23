import { defineConfig } from "@playwright/test";

const viewports = [
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-360", width: 360, height: 640 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "landscape-844", width: 844, height: 390 },
];

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results/phase-3",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    channel: "chrome",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: viewports.map(({ name, width, height }) => ({
    name,
    use: { viewport: { width, height }, deviceScaleFactor: 1 },
  })),
  webServer: {
    command: "npm run dev -- --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
