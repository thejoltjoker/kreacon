import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/admin/users');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.locator('input[name="email"]').click();
  await page.locator('input[name="email"]').fill('john.doe@example.com');
  await page.locator('input[name="email"]').press('Tab');
  await page.locator('input[name="password"]').fill('password');
  await page.locator('input[name="password"]').press('Enter');
  await page.locator('input[name="password"]').press('Tab');
  await page.getByRole('button', { name: 'Log in' }).press('Enter');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'john_doe' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('button', { name: 'Username' }).click();
  await expect(page.locator('body')).toContainText('alice_smith');
  await page.getByRole('button', { name: 'Username' }).click();
  await expect(page.locator('body')).toContainText('john_doe');
  await page.locator('#bits-42').getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Ban user' }).click();
  await expect(page.locator('body')).toContainText('Banned');
  await page.locator('#bits-42').getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Show tickets' }).click();
  http://localhost:5173/admin/tickets?username=jane_doe
});