import { test, expect } from '@playwright/test';

test('Unauthorized access to admin pages', async ({ page }) => {
	const response = await page.goto('/admin');
	await expect(response?.status()).toBe(401);
});

test('test', async ({ page }) => {
	await page.goto('/login');
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="password"]').fill('password');
	await page.getByRole('button', { name: 'Login' }).click();
	await page.waitForURL('/profile');
	await page.goto('/admin/events');
	const eventsList = await page.locator('.events-list');
	// List item should exist
	await expect(eventsList.locator('li').first()).toContainText('Id');
	await expect(eventsList.locator('li').first()).toContainText('Name');
	await expect(eventsList.locator('li').first()).toContainText('Slug');
	await expect(eventsList.locator('li').first()).toContainText('Submissions Open At');
	await expect(eventsList.locator('li').first()).toContainText('Submissions Close At');
	await expect(eventsList.locator('li').first()).toContainText('Voting Open At');
	await expect(eventsList.locator('li').first()).toContainText('Voting Close At');
	await expect(eventsList.locator('li').first()).toContainText('Created At');
	await expect(eventsList.locator('li').first()).toContainText('Updated At');

	// Sorting should work
	await expect(eventsList.locator('li').first()).toContainText('LanHack Winter');
	await expect(eventsList.locator('li').last()).toContainText('Beacon Summer');
	const sortBySelect = await page.locator('.sort-by-select');
	await expect(sortBySelect).toContainText('Sorted by: Newest');
	await page.goto('/admin/events?sortBy=oldest');
	await expect(sortBySelect).toContainText('Sorted by: Oldest');
	await expect(eventsList.locator('li').first()).toContainText('Beacon Summer');
	await expect(eventsList.locator('li').last()).toContainText('LanHack Winter');

	// Search filter should work
	await page.getByPlaceholder('Search').fill('lanhack');
	await expect(eventsList.locator('li').first()).toContainText('LanHack Winter');
	await expect(eventsList.locator('li').last()).not.toContainText('Beacon Summer');
	await expect(page).toHaveURL(/.*[?&]q=lanhack.*/);
});
