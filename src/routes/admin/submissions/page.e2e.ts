import { test, expect } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

test('Admin should be able to manage submissions', async ({ page }) => {
	// First, try accessing the admin page without authentication
	const response = await page.goto('/admin/submissions');
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
	await page.locator('a[href="/admin/submissions"]').click();
	await page.waitForURL('/admin/submissions');
	const entityListLocator = page.locator('.entity-list');
	await expect(entityListLocator.locator('li').first()).toContainText('Truisms');

	// Sort by title
	await page.getByRole('button', { name: 'Title' }).click();
	await expect(entityListLocator.locator('li').first()).toContainText('99 Cent');
	await page.getByRole('button', { name: 'Title' }).click();
	await expect(entityListLocator.locator('li').first()).toContainText('Your Body is');

	// TODO Don't use bits selector
	const listItemLocator = entityListLocator.locator('li').first();
	const listItemActionsLocator = listItemLocator.getByRole('button').nth(1);

	// Set rejected
	await listItemActionsLocator.click();
	await page.getByRole('menuitem', { name: 'Reject' }).click();
	const statusLocator = listItemLocator.locator('div:nth-child(6) > .w-full').first();
	await expect(statusLocator).toContainText('rejected');

	// Set published
	await listItemActionsLocator.click();
	await page.getByRole('menuitem', { name: 'Publish' }).click();
	await expect(statusLocator).toContainText('published');

	// Set rejected
	await listItemActionsLocator.click();
	await page.getByRole('menuitem', { name: 'Reject' }).click();
	await expect(statusLocator).toContainText('rejected');

	// Delete
	await expect(listItemLocator).toBeVisible();
	await listItemActionsLocator.click();
	await page.getByRole('menuitem', { name: 'Delete' }).click();

	await page.getByPlaceholder('Enter confirmation').click();
	await page.getByPlaceholder('Enter confirmation').fill('StrongCuriousWolfhound');
	await page.waitForTimeout(100);
	const dialogLocator = page.getByLabel('Delete submission');
	await expect(dialogLocator).toBeVisible();
	const deleteButton = dialogLocator.getByRole('button', { name: 'Delete' });
	await expect(deleteButton).toBeVisible();
	await deleteButton.click();
	await expect(dialogLocator).not.toBeVisible();
	await expect(listItemLocator).not.toBeVisible();
});
