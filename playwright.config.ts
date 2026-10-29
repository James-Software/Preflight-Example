import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

const baseURL = process.env.DEMO_URL || "http://127.0.0.1:3000";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  use: {
    baseURL,
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    },
  },
  webServer: process.env.DEMO_URL ? undefined : {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
