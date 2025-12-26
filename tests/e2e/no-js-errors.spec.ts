import { test, expect } from '@playwright/test';

test.describe('No JavaScript Errors', () => {
  test('login page loads without JS errors', async ({ page }) => {
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    await page.goto('/login');
    await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    
    // Check no critical JS errors (Recoil/React)
    const criticalErrors = jsErrors.filter(e => 
      e.includes('Recoil') || 
      e.includes('ReactCurrentDispatcher') ||
      e.includes('Cannot destructure')
    );
    expect(criticalErrors).toHaveLength(0);
    
    // Check page rendered - use more specific selector
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('home page loads without JS errors', async ({ page }) => {
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check no critical JS errors
    const criticalErrors = jsErrors.filter(e => 
      e.includes('Recoil') || 
      e.includes('ReactCurrentDispatcher') ||
      e.includes('Cannot destructure')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
