import { expect, test } from '@playwright/test';

test('Login should redirect to profile', async ({ page }) => {
	await page.goto('http://localhost:5173/login');
	await page.locator('input[name="email"]').click();
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="password"]').click();
	await page.locator('input[name="password"]').fill('password');
	await page.getByRole('button', { name: 'Login' }).click();
	await page.waitForURL('/profile');
});
test('Should show message if login fails', async ({ page }) => {
	await page.goto('http://localhost:5173/login');
	await page.locator('input[name="email"]').click();
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="password"]').click();
	await page.locator('input[name="password"]').fill('no-password');
	await page.getByRole('button', { name: 'Login' }).click();
	await page.waitForURL('/login');
	await expect(page.locator('.message')).toHaveText('Incorrect username or password');
});
