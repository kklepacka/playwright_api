import { test, expect } from '@playwright/test';

test('check the title of the webpage', async ({ page }) => {
  // Navigate to the website
  await page.goto('https://playwright.dev/');

  // Check if the title of the page is as expected
  await expect(page).toHaveTitle(/Playwright/);
});