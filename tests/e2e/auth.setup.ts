import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Go to login page
  await page.goto('/login');

  // Wait for page to load
  await page.waitForSelector('input[placeholder*="email"]', { timeout: 10000 });

  // Fill in credentials using the actual test user
  await page.fill('input[placeholder*="email"]', 'superadmin@asap.edu.pk');
  await page.fill('input[placeholder*="password"]', 'password123');

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard
  await page.waitForURL(/dashboard|admin/i, { timeout: 15000 });

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
