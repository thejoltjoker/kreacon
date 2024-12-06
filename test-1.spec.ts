import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/users/john_doe/submissions');
  await expect(page.locator('.flex > div > div > div').first()).toBeVisible();
  await expect(page.locator('body')).toContainText('john_doe');
  await page.getByText('Member since dec 6,').click();
  await expect(page.locator('body')).toContainText('Member since dec 6, 2024');
  await expect(page.getByText('4 events')).toBeVisible();
  await expect(page.locator('ul').filter({ hasText: 'Submissions Sorted by: Newest' }).getByRole('link')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Whispers of the Forgotten' })).toBeVisible();
});