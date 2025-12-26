import { test, expect } from '@playwright/test';

// These tests require authentication
test.use({ storageState: 'tests/.auth/user.json' });

test.describe('Admin Dashboard', () => {
  test('dashboard page loads', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveTitle(/Dashboard/i);
  });
});

test.describe('Admin Users', () => {
  test('users listing page loads', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveTitle(/Users/i);
    // Wait for AG Grid to load
    await expect(page.locator('.ag-root-wrapper, [class*="DataGridTable"]')).toBeVisible({ timeout: 10000 });
  });

  test('users listing API returns data', async ({ page, request }) => {
    const response = await request.post('/admin/users/listing', {
      data: { pageSize: 10, current: 1 }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('total');
  });
});

test.describe('Admin Students', () => {
  test('students listing page loads', async ({ page }) => {
    await page.goto('/admin/students');
    await expect(page).toHaveTitle(/Students/i);
    await expect(page.locator('.ag-root-wrapper, [class*="DataGridTable"]')).toBeVisible({ timeout: 10000 });
  });

  test('students listing API returns data', async ({ page, request }) => {
    const response = await request.post('/admin/students/listing', {
      data: { pageSize: 10, current: 1 }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('data');
  });
});

test.describe('Admin Applications', () => {
  test('applications listing page loads', async ({ page }) => {
    await page.goto('/admin/applications');
    await expect(page).toHaveTitle(/Applications/i);
    await expect(page.locator('.ag-root-wrapper, [class*="DataGridTable"]')).toBeVisible({ timeout: 10000 });
  });

  test('applications listing API returns data', async ({ page, request }) => {
    const response = await request.post('/admin/applications/listing', {
      data: { pageSize: 10, current: 1 }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('data');
  });
});

test.describe('Admin Projects', () => {
  test('projects listing page loads', async ({ page }) => {
    await page.goto('/admin/projects');
    await expect(page).toHaveTitle(/Projects/i);
    await expect(page.locator('.ag-root-wrapper, [class*="DataGridTable"]')).toBeVisible({ timeout: 10000 });
  });

  test('projects listing API returns data', async ({ page, request }) => {
    const response = await request.post('/admin/projects/listing', {
      data: { pageSize: 10, current: 1 }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('data');
  });
});

test.describe('Admin Roles', () => {
  test('roles listing page loads', async ({ page }) => {
    await page.goto('/admin/roles');
    await expect(page).toHaveTitle(/Roles/i);
    await expect(page.locator('.ag-root-wrapper, [class*="DataGridTable"]')).toBeVisible({ timeout: 10000 });
  });

  test('roles listing API returns data', async ({ page, request }) => {
    const response = await request.post('/admin/roles/listing', {
      data: { pageSize: 10, current: 1 }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('data');
  });
});

test.describe('Admin Employees', () => {
  test('employees listing page loads', async ({ page }) => {
    await page.goto('/admin/employees');
    await expect(page).toHaveTitle(/Employees/i);
    await expect(page.locator('.ag-root-wrapper, [class*="DataGridTable"]')).toBeVisible({ timeout: 10000 });
  });

  test('employees listing API returns data', async ({ page, request }) => {
    const response = await request.post('/admin/employees/listing', {
      data: { pageSize: 10, current: 1 }
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('data');
  });
});

test.describe('Admin CMS', () => {
  test('slides listing page loads', async ({ page }) => {
    await page.goto('/admin/slides');
    await expect(page).toHaveTitle(/Slides/i);
  });

  test('gallery listing page loads', async ({ page }) => {
    await page.goto('/admin/gallery');
    await expect(page).toHaveTitle(/Gallery/i);
  });

  test('content listing page loads', async ({ page }) => {
    await page.goto('/admin/content');
    await expect(page).toHaveTitle(/Content/i);
  });
});
