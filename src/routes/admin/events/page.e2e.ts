import { test, expect } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

test('Unauthorized access to admin pages', async ({ page }) => {
	const response = await page.goto('/admin');
	await expect(response?.status()).toBe(StatusCodes.UNAUTHORIZED);
	// TODO Login as normal user and get 403
	// TODO Login as admin and get 200
});

test('Login and view events', async ({ page }) => {
	await page.goto('/login');
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="password"]').fill('password');
	await page.locator('.login-button').click();
	await page.waitForURL('/profile');
	await page.goto('/admin/events');
	const eventsList = await page.locator('.entity-list');
	// List item should exist
	await expect(eventsList.locator('li').first()).toContainText('Name');
	await expect(eventsList.locator('li').first()).toContainText('Slug');
	await expect(eventsList.locator('li').first()).toContainText('Submissions Open At');
	await expect(eventsList.locator('li').first()).toContainText('Submissions Close At');
	await expect(eventsList.locator('li').first()).toContainText('Voting Open At');
	await expect(eventsList.locator('li').first()).toContainText('Voting Close At');

	// Sorting should work
	await expect(eventsList.locator('li').first()).toContainText('LanHack Winter');
	await expect(eventsList.locator('li').last()).toContainText('Beacon Summer');
	await page.goto('/admin/events?sortBy=oldest');
	await expect(eventsList.locator('li').first()).toContainText('Beacon Summer');
	await expect(eventsList.locator('li').last()).toContainText('LanHack Winter');

	// Search filter should work
	await page.getByPlaceholder('Search').fill('lanhack');
	await expect(eventsList.locator('li').first()).toContainText('LanHack Winter');
	await expect(eventsList.locator('li').last()).not.toContainText('Beacon Summer');
	await expect(page).toHaveURL(/.*[?&]q=lanhack.*/);
});

test('Admin should be able to create, edit and delete events', async ({ page }) => {
	await page.goto('/admin/events');
	// First, try accessing the admin page without authentication
	const response = await page.goto('/admin/categories');
	expect(response?.status()).toBe(StatusCodes.UNAUTHORIZED);

	// Continue with the rest of the test (login and category management)
	await page.getByRole('link', { name: 'Login' }).click();
	await page.locator('input[name="email"]').click();
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="email"]').press('Tab');
	await page.locator('input[name="password"]').click();
	await page.locator('input[name="password"]').fill('password');
	await page.locator('input[name="password"]').press('Enter');
	await page.getByRole('button', { name: 'Log in' }).click();

	await page.getByRole('button', { name: 'john_doe' }).click();
	await page.getByRole('link', { name: 'Admin' }).click();
	await page.getByRole('link', { name: 'Add events' }).click();
	await page.locator('input[name="name"]').click();
	await page.locator('input[name="name"]').fill('My test event');
	await page.locator('input[name="name"]').press('Tab');
	await page.locator('input[name="description"]').fill('This is a test description');
	await page.locator('input[name="description"]').press('Tab');
	await page.getByRole('spinbutton', { name: 'month, Submissions Open At' }).press('Tab');
	await page.getByLabel('16').press('Tab');
	await page.getByRole('spinbutton', { name: 'year, Submissions Open At' }).press('Tab');
	await page.getByRole('spinbutton', { name: 'hour, Submissions Open At' }).press('Tab');
	await page.getByRole('spinbutton', { name: 'minute, Submissions Open At' }).press('Tab');
	await page.getByRole('spinbutton', { name: 'month, Submissions Close At' }).press('Tab');
	await page.getByRole('spinbutton', { name: 'day, Submissions Close At' }).press('Tab');
	await page.getByRole('spinbutton', { name: 'year, Submissions Close At' }).press('ArrowUp');
	await page.getByLabel('2025').press('ArrowUp');
	await page.getByLabel('2026').press('ArrowDown');
	await page.getByLabel('2025').press('ArrowDown');
	await page.getByRole('spinbutton', { name: 'year, Submissions Close At' }).press('ArrowLeft');
	await page.getByRole('spinbutton', { name: 'day, Submissions Close At' }).press('ArrowLeft');
	await page.getByRole('spinbutton', { name: 'month, Submissions Close At' }).press('ArrowRight');
	await page.getByRole('button', { name: 'Add Rule' }).click();
	await page.locator('form').getByRole('listitem').getByRole('textbox').fill('My first rule');
	await page.locator('form').getByRole('listitem').getByRole('textbox').press('Enter');
	await page.getByRole('textbox').nth(3).fill('Second rule');
	await page.getByRole('textbox').nth(3).press('Enter');
	await page.getByRole('button', { name: 'Add Category' }).click();
	await page.getByRole('button', { name: 'Select a category' }).click();
	await page.getByRole('option', { name: 'Combined Demo' }).click();
	await page.getByRole('button', { name: 'Add Rule' }).nth(1).click();
	await page
		.locator('form div')
		.filter({ hasText: 'Category: Combined Demo' })
		.locator('input[type="text"]')
		.fill('First category rule');
	await page
		.locator('form div')
		.filter({ hasText: 'Category: Combined Demo' })
		.locator('input[type="text"]')
		.press('Enter');
	await page.getByRole('button', { name: 'Create Event' }).click();
	// TODO Replace bits locator
	await page.locator('#bits-120').getByRole('button').click();
	await page.getByRole('menuitem', { name: 'Edit' }).click();
	await page.locator('input[name="name"]').click();
	await page.locator('input[name="name"]').fill('My test event edited');
	await page.locator('input[name="name"]').press('Tab');
	await page.locator('input[name="description"]').press('ArrowRight');
	await page
		.locator('input[name="description"]')
		.fill("This is a test description that's also edited");
	await page.getByRole('spinbutton', { name: 'day, Voting Open At' }).click();
	await page.locator('.relative > .relative > .lucide-icon').first().click();
	await page.locator('input[type="text"]').nth(2).click();
	await page.locator('input[type="text"]').nth(2).fill('My first rule edited');
	await page
		.locator('form div')
		.filter({ hasText: 'General Rules Add Rule' })
		.getByRole('button')
		.click();
	await page.locator('li:nth-child(3) > div > .relative > .w-full').fill('third rule added');
	await page.getByRole('button', { name: 'Add Category' }).click();
	await page.getByRole('button', { name: 'Select a category' }).click();
	await page.getByRole('option', { name: 'Tracked Music' }).click();
	await page.getByRole('button', { name: 'Add Rule' }).nth(2).click();
	await page
		.locator('form div')
		.filter({ hasText: 'Category: Tracked Music' })
		.locator('input[type="text"]')
		.fill('added category');
	await page
		.locator('form div')
		.filter({ hasText: 'Category: Tracked Music' })
		.locator('input[type="text"]')
		.press('Enter');
	await page.getByRole('button', { name: 'Update Event' }).click();
	await expect(page.locator('body')).toMatchAriaSnapshot(`
    - listitem:
      - paragraph: My test event edited
      - paragraph: Name
      - paragraph: my-test-event-edited
      - paragraph: Slug
      - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
      - paragraph: Submissions Open At
      - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
      - paragraph: Submissions Close At
      - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
      - paragraph: Voting Open At
      - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
      - paragraph: Voting Close At
      - button:
        - button:
          - img
    `);
	// TODO Replace bits locator
	const itemLocator = page.locator('li').filter({ hasText: 'My test event edited' });
	await itemLocator.getByRole('button').nth(1).click();
	await page.locator('html').click();
	await expect(itemLocator.getByText('My test event edited Namemy-')).toBeVisible();
	// TODO Replace bits locator
	await itemLocator.getByRole('button').nth(1).click();
	await page.getByRole('menuitem', { name: 'Delete' }).click();
	await expect(itemLocator.getByText('My test event edited Namemy-')).not.toBeVisible();
});
