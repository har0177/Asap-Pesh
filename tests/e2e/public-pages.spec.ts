import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ASA|Home/i);
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/About/i);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Contact/i);
    // Check for contact form
    await expect(page.locator('form')).toBeVisible();
  });

  test('gallery page loads', async ({ page }) => {
    await page.goto('/gallery');
    await expect(page).toHaveTitle(/Gallery/i);
  });

  test('staff page loads', async ({ page }) => {
    await page.goto('/staff');
    await expect(page).toHaveTitle(/Staff/i);
  });

  test('merit list page loads', async ({ page }) => {
    await page.goto('/merit-list');
    await expect(page).toHaveTitle(/Merit/i);
  });
});
