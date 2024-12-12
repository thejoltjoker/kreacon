import { expect, test } from '@playwright/test';

test('Login should redirect to profile', async ({ page }) => {
	await page.goto('/login');
	await page.locator('input[name="email"]').click();
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="password"]').click();
	await page.locator('input[name="password"]').fill('password');
	await page.locator('.login-button').click();
	await page.waitForURL('/profile');
});
test('Should show message if login fails', async ({ page }) => {
	await page.goto('/login');
	await page.locator('input[name="email"]').click();
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="password"]').click();
	await page.locator('input[name="password"]').fill('no-password');
	await page.locator('.login-button').click();
	await page.waitForURL('/login');
	await expect(page.locator('.message')).toHaveText('Incorrect email or password');
});
