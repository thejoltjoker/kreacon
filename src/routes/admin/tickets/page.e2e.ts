import { test, expect } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

test('Admin should be able to manage tickets', async ({ page }) => {
	// Should not be able to access admin tickets page without authentication
	const response = await page.goto('/admin/tickets');
	await expect(response?.status()).toBe(StatusCodes.UNAUTHORIZED);

	// Login and access admin users page
	await page.goto('/login');
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="password"]').fill('password');
	await page.keyboard.press('Enter');
	await page.waitForURL('/profile');

	// Go to admin users page
	await page.goto('/admin/tickets');
	const entityListLocator = page.locator('.entity-list');
	await page.getByLabel('Filter by event').click();
	await page.getByRole('option', { name: 'Beacon Winter 1991' }).click();
	await expect(page.locator('.pagination')).toContainText('Showing 0-4 of 4');
	await entityListLocator.locator('li').first().getByRole('button').nth(1).click();
	await page.getByRole('menuitem', { name: 'Delete' }).click();
	await expect(page.locator('.pagination')).toContainText('Showing 0-3 of 3');
});
