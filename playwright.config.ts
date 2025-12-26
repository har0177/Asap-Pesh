import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://asap.test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Unauthenticated tests - no setup required
    {
      name: 'noauth',
      testMatch: /no-js-errors\.spec\.ts/,
    },
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: /no-js-errors\.spec\.ts/,
    },
  ],
});
