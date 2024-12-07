import { test, expect } from '@playwright/test';

test('User details', async ({ page }) => {
	await page.goto('/users/john_doe/submissions');
	const userDetails = page.locator('#user-details');
	await expect(userDetails).toBeVisible();
	await expect(userDetails.getByRole('heading', { name: 'john_doe' })).toBeVisible();
	await expect(userDetails.locator('.member-since').first()).toContainText('Member since');
	await expect(userDetails.locator('.user-stats').first()).toContainText('events');
	await expect(userDetails.locator('.user-stats').first()).toContainText('submissions');
});

test('Redirects to submissions', async ({ page }) => {
	await page.goto('/users/john_doe');
	await expect(page.url()).toContain('/users/john_doe/submissions');
});
