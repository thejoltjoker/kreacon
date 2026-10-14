import { test, expect, type Page } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

async function selectDropdownOption(page: Page, optionName: string) {
	await page.getByRole('option', { name: optionName }).waitFor({ state: 'attached' });
	await page.keyboard.type(optionName, { delay: 20 });
	await page.keyboard.press('Enter');
}

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
	await expect(eventsList.locator('li').first()).toContainText('Beacon 2026');
	await expect(eventsList.locator('li').last()).toContainText('Mesozoic Masterpieces');
	await page.goto('/admin/events?sortBy=oldest');
	await expect(eventsList.locator('li').first()).toContainText('Mesozoic Masterpieces');
	await expect(eventsList.locator('li').last()).toContainText('Beacon 2026');

	// Search filter should work
	await page.getByPlaceholder('Search').fill('debug');
	await expect(eventsList.locator('li').first()).toContainText('Debug Derby');
	await expect(eventsList.locator('li').last()).not.toContainText('Mesozoic Masterpieces');
	await expect(page).toHaveURL(/.*[?&]q=debug.*/);
});

test('Admin should be able to create and edit events', async ({ page }) => {
	test.setTimeout(60_000);
	await page.setViewportSize({ width: 1280, height: 1200 });
	await page.goto('/admin/events');
	// First, try accessing the admin page without authentication
	const response = await page.goto('/admin/categories');
	expect(response?.status()).toBe(StatusCodes.UNAUTHORIZED);

	// Continue with the rest of the test (login and category management)
	await page.getByRole('link', { name: 'Log in' }).click();
	await page.locator('input[name="email"]').click();
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="email"]').press('Tab');
	await page.locator('input[name="password"]').click();
	await page.locator('input[name="password"]').fill('password');
	await page.locator('input[name="password"]').press('Enter');
	await page.getByRole('button', { name: 'Log in' }).click();

	await page.getByRole('button', { name: 'john_doe avatar' }).click();
	await page.getByRole('link', { name: 'Admin' }).click();
	await page.waitForURL('/admin/entries');
	await page.getByRole('link', { name: 'Events' }).click();
	await page.waitForURL('/admin/events');
	await page.getByRole('link', { name: 'Add events' }).click();
	await page.locator('input[name="name"]').click();
	await page.locator('input[name="name"]').fill('My test event');
	await page.locator('input[name="name"]').press('Tab');
	await page.locator('input[name="tagline"]').fill('Best test ever');
	await page.locator('input[name="tagline"]').press('Tab');
	await page.locator('input[name="description"]').fill('This is a test description');
	await page.locator('input[name="description"]').press('Tab');
	await page.getByRole('spinbutton', { name: 'month, Submissions Open At' }).press('Tab');
	await page.getByRole('spinbutton', { name: 'year, Submissions Open At' }).press('Tab');
	await page.getByRole('spinbutton', { name: 'hour, Submissions Open At' }).press('Tab');
	await page.getByRole('spinbutton', { name: 'minute, Submissions Open At' }).press('Tab');
	await page.getByRole('spinbutton', { name: 'month, Submissions Close At' }).press('Tab');
	await page.getByRole('spinbutton', { name: 'day, Submissions Close At' }).press('Tab');
	await page.getByRole('spinbutton', { name: 'year, Submissions Close At' }).press('ArrowUp');
	await page.getByRole('spinbutton', { name: 'year, Submissions Close At' }).press('ArrowLeft');
	await page.getByRole('spinbutton', { name: 'day, Submissions Close At' }).press('ArrowLeft');
	await page.getByRole('spinbutton', { name: 'month, Submissions Close At' }).press('ArrowRight');
	await page.getByRole('button', { name: 'Add Rule' }).click();
	await page.locator('form').getByRole('listitem').getByRole('textbox').fill('My first rule');
	await page.locator('form').getByRole('listitem').getByRole('textbox').press('Enter');
	await page.getByRole('textbox').nth(4).fill('Second rule');
	await page.getByRole('textbox').nth(4).press('Enter');
	await page.getByRole('button', { name: 'Add Category' }).click();
	const categoryTrigger = page.getByRole('button', { name: 'Select a category' });
	await categoryTrigger.evaluate((el) => el.scrollIntoView({ block: 'center' }));
	await categoryTrigger.click();
	await selectDropdownOption(page, 'Archeological Photography');
	await expect(page.getByRole('heading', { name: 'Category: Archeological Photography' })).toBeVisible();
	await page.getByRole('button', { name: 'Add Rule' }).nth(1).click();
	await page
		.locator('form div')
		.filter({ hasText: 'Category: Archeological Photography' })
		.locator('input[type="text"]')
		.fill('First category rule');
	await page
		.locator('form div')
		.filter({ hasText: 'Category: Archeological Photography' })
		.locator('input[type="text"]')
		.press('Enter');
	await page.getByRole('button', { name: 'Create Event' }).click();
	await page.waitForURL('/admin/events');
	const entityListLocator = page.locator('.entity-list');
	const listItemLocator = entityListLocator.locator('li').filter({ hasText: 'My test event' });
	await listItemLocator.getByRole('button').nth(1).click();
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
	const secondCategoryTrigger = page.getByRole('button', { name: 'Select a category' });
	await secondCategoryTrigger.evaluate((el) => el.scrollIntoView({ block: 'center' }));
	await secondCategoryTrigger.click();
	await selectDropdownOption(page, 'Prehistoric Sounds');
	await expect(page.getByRole('heading', { name: 'Category: Prehistoric Sounds' })).toBeVisible();
	await page.getByRole('button', { name: 'Add Rule' }).nth(2).click();
	await page
		.locator('form div')
		.filter({ hasText: 'Category: Prehistoric Sounds' })
		.locator('input[type="text"]')
		.fill('added category');
	await page
		.locator('form div')
		.filter({ hasText: 'Category: Prehistoric Sounds' })
		.locator('input[type="text"]')
		.press('Enter');
	await page.getByRole('button', { name: 'Update Event' }).click();

	const itemLocator = page.locator('li').filter({ hasText: 'My test event edited' });
	await itemLocator.getByRole('button').nth(1).click();
	await page.locator('html').click();
	await expect(itemLocator.getByText('My test event edited')).toBeVisible();
});
