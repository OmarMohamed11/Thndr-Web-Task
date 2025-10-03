import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('should load the app', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Nasdaq Stocks/);
  });

  test('should display main heading', async ({ page }) => {
    await page.goto('/');
    
    const heading = page.getByRole('heading', { name: /Nasdaq Stocks/i });
    await expect(heading).toBeVisible();
  });
});

