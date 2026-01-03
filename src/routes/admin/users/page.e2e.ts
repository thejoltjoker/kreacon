import { test, expect } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

test('Admin should be able to manage users', async ({ page }) => {
	// Should not be able to access admin users page without authentication
	const response = await page.goto('/admin/users');
	await expect(response?.status()).toBe(StatusCodes.UNAUTHORIZED);

	// Login and access admin users page
	await page.goto('/login');
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="password"]').fill('password');
	await page.keyboard.press('Enter');
	await page.getByRole('button', { name: 'john_doe' }).click();

	// Go to admin users page
	await page.goto('/admin/users');
	const entityListLocator = page.locator('.entity-list');

	// Sorting by name
	await page.goto('/admin/users?sortBy=username_asc');
	await expect(entityListLocator.locator('li').first()).toContainText('alice_smith');
	await page.goto('/admin/users?sortBy=username_desc');
	await expect(entityListLocator.locator('li').first()).toContainText('wilma_flintstone');

	// Show tickets
	const listItemLocator = entityListLocator.locator('li', { hasText: 'alice_smith' });
	const listItemActionsLocator = listItemLocator.getByRole('button').nth(1);
	await listItemActionsLocator.click();
	await page.getByRole('menuitem', { name: 'Show tickets' }).click();
	await page.waitForURL('/admin/tickets?username=alice_smith');

	// Ban user
	await page.goto('/admin/users');
	await expect(listItemLocator.locator('div:nth-child(7)').first()).toContainText('active');
	await listItemActionsLocator.click();
	await page.getByRole('menuitem', { name: 'Ban user' }).click();
	await expect(listItemLocator.locator('div:nth-child(7)').first()).toContainText('banned');

	// Toggle admin
	// TODO Add a test to verify that an admin cannot toggle their own admin status
	await page.goto('/admin/users');
	const roleLocator = listItemLocator.locator('div:nth-child(3)').first();
	await expect(roleLocator).toContainText('user');
	await listItemActionsLocator.click();
	await page.getByRole('menuitem', { name: 'Toggle admin' }).click();
	await expect(roleLocator).toContainText('admin');

	// Toggle back to user
	await listItemActionsLocator.click();
	await page.getByRole('menuitem', { name: 'Toggle admin' }).click();
	await expect(roleLocator).toContainText('user');
});
