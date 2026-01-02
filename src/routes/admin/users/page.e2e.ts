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
});

test('Admin should be able to change user roles', async ({ page }) => {
	// Login as admin
	await page.goto('/login');
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="password"]').fill('password');
	await page.keyboard.press('Enter');
	await page.getByRole('button', { name: 'john_doe' }).click();

	// Go to admin users page
	await page.goto('/admin/users');
	const entityListLocator = page.locator('.entity-list');

	// Find alice_smith's list item
	const aliceListItem = entityListLocator.locator('li', { hasText: 'alice_smith' });

	// Find the role select dropdown (it should be in div:nth-child(4) based on field order)
	const roleSelect = aliceListItem.locator('button.select-trigger').first();

	// Verify current role is "user"
	await expect(roleSelect).toContainText('User');

	// Click the role select to open dropdown and wait for the PATCH request
	await roleSelect.click();
	const updatePromise = page.waitForResponse(
		(response) =>
			response.url().includes('/admin/users/alice_smith') && response.request().method() === 'PATCH'
	);
	
	// Select "Admin" from the dropdown
	await page.getByRole('option', { name: 'Admin' }).click();

	// Wait for the update to complete
	await updatePromise;
	await expect(roleSelect).toContainText('Admin');

	// Change it back to "user"
	await roleSelect.click();
	const updatePromise2 = page.waitForResponse(
		(response) =>
			response.url().includes('/admin/users/alice_smith') && response.request().method() === 'PATCH'
	);
	await page.getByRole('option', { name: 'User' }).click();

	// Verify it changed back
	await updatePromise2;
	await expect(roleSelect).toContainText('User');
});
