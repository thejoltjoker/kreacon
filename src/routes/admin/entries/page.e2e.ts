import { test, expect } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

test('Admin should be able to manage entries', async ({ page }) => {
	// First, try accessing the admin page without authentication
	const response = await page.goto('/admin/entries');
	expect(response?.status()).toBe(StatusCodes.UNAUTHORIZED);

	// Continue with the rest of the test (login and category management)
	await page.goto('/login');
	await page.locator('input[name="email"]').click();
	await page.locator('input[name="email"]').fill('john.doe@example.com');

	await page.locator('input[name="password"]').click();
	await page.locator('input[name="password"]').fill('password');
	await page.locator('input[name="email"]').press('Enter');

	// Go to the admin panel through account menu
	await page.getByRole('button', { name: 'john_doe' }).click();
	await page.getByRole('link', { name: 'Admin' }).click();

	// Sorting and filtering
	await page.waitForURL('/admin/entries');
	const entityListLocator = page.locator('.entity-list');
	// Show newest first
	await expect(entityListLocator.locator('li').first()).toContainText('Stegosaurus at Sunset');

	// Sort by title
	await page.getByRole('button', { name: 'Title' }).click();
	await expect(entityListLocator.locator('li').first()).toContainText('Gentle Giants');
	await page.getByRole('button', { name: 'Title' }).click();
	await expect(entityListLocator.locator('li').first()).toContainText('T-Rex in Morning Light');

	// TODO Don't use bits selector
	const listItemLocator = entityListLocator.locator('li').first();
	const listItemActionsLocator = listItemLocator.getByRole('button').nth(1);

	// Set rejected
	await listItemActionsLocator.click();
	await page.getByRole('menuitem', { name: 'Reject' }).click();
	const statusLocator = listItemLocator.locator('div:nth-child(6) > .w-full').first();
	await expect(statusLocator).toContainText('Rejected');

	// Set published
	await listItemActionsLocator.click();
	await page.getByRole('menuitem', { name: 'Publish' }).click();
	await expect(statusLocator).toContainText('Published');

	// Set rejected
	await listItemActionsLocator.click();
	await page.getByRole('menuitem', { name: 'Reject' }).click();
	await expect(statusLocator).toContainText('Rejected');

	// TODO Delete
});
