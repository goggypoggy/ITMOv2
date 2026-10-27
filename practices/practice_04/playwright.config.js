// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:8080',
    viewport: { width: 1200, height: 800 },
    actionTimeout: 10_000,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx --yes serve -l 8080 .',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
