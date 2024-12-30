import { test, expect } from '@playwright/test';

test('User should be able to update their information', async ({ page }) => {
	// Should redirect to login page if not authenticated
	await page.goto('/profile');
	await page.waitForURL('/login');

	// Login and access profile page
	await page.goto('/login');
	await page.locator('input[name="email"]').fill('wilma.flintstone@example.com');
	await page.locator('input[name="password"]').fill('password');
	await page.keyboard.press('Enter');
	await page.waitForURL('/profile');

	const generalSection = page.locator('section', { hasText: 'General' });
	// Should show the current username
	await expect(generalSection.locator('input[name="username"]')).toBeVisible();
	await expect(generalSection.locator('input[name="username"]')).toHaveValue('wilma_flintstone');

	// Should show the edit button and change to cancel when editing
	const editButton = generalSection.getByRole('button', { name: 'Edit' });
	await editButton.click();
	await expect(generalSection.locator('form')).toContainText('Cancel');

	// Should update the username
	await expect(generalSection.locator('input[name="username"]')).toHaveValue('wilma_flintstone');
	await expect(generalSection.locator('form')).toContainText('Cancel');
	await generalSection.locator('input[name="username"]').fill('jane_doe');
	await generalSection.getByRole('button', { name: 'Update' }).click();
	await expect(generalSection.locator('input[name="username"]')).toHaveValue('jane_doe');
	await expect(generalSection.locator('form')).toContainText('Edit');
	await expect(generalSection.getByText('Profile updated successfully!')).toBeVisible();
	await generalSection.getByRole('button', { name: 'Edit' }).click();
	await expect(generalSection.locator('input[name="username"]')).toHaveValue('jane_doe');
	await generalSection.locator('input[name="username"]').fill('alice_smith');
	await generalSection.getByRole('button', { name: 'Update' }).click();
	await expect(generalSection.getByText('Username unavailable.')).toBeVisible();
	await expect(generalSection.locator('form')).toContainText('Cancel');
	await expect(generalSection.getByRole('button', { name: 'Update' })).toBeVisible();

	// Change username back to wilma_flintstone
	await generalSection.locator('input[name="username"]').fill('wilma_flintstone');
	await generalSection.getByRole('button', { name: 'Update' }).click();
	await expect(generalSection.locator('input[name="username"]')).toHaveValue('wilma_flintstone');
	await expect(generalSection.locator('form')).toContainText('Edit');
	await expect(generalSection.getByText('Profile updated successfully!')).toBeVisible();

	// TODO Update email
	// TODO Add ticket
});
