import { test, expect } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';

test('Admin should be able to create, edit and delete categories', async ({ page }) => {
	// First, try accessing the admin page without authentication
	const response = await page.goto('/admin/categories');
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

	// Create new category
	await page.getByRole('link', { name: 'Categories' }).click();
	await page.getByRole('link', { name: 'Add Category' }).click();
	await page.locator('input[name="name"]').click();
	await page.locator('input[name="name"]').fill('My test category');
	await page.locator('input[name="name"]').press('Tab');
	await page.locator('textarea[name="description"]').fill('This is a test description');
	await page.locator('textarea[name="description"]').press('Tab');
	await page.getByRole('button', { name: 'Select Media Type' }).click();
	await page.getByRole('option', { name: 'Image' }).click();
	await page.getByRole('button', { name: 'Create Category' }).click();

	// Verify new category is created
	const newCategoryLocator = await page.locator('li').filter({ hasText: 'My test category' });
	await expect(newCategoryLocator).toMatchAriaSnapshot(`
    - listitem:
      - paragraph: My test category
      - paragraph: Name
      - paragraph: This is a test description
      - paragraph: Description
      - paragraph: my-test-category
      - paragraph: Slug
      - paragraph: image
      - paragraph: Media Type
      - button:
        - button:
          - img
    `);

	// Edit new category
	await newCategoryLocator.getByRole('button').nth(1).click();
	await page.getByRole('menuitem', { name: 'Edit' }).click();
	await page.locator('input[name="name"]').click();
	await page.locator('input[name="name"]').fill('My test category should be edited');
	await page.locator('textarea[name="description"]').click();
	await page
		.locator('textarea[name="description"]')
		.fill('This is a test description that i edited');
	await page.locator('textarea[name="description"]').press('Tab');
	await page.locator('input[name="slug"]').press('ArrowRight');
	await page.locator('input[name="slug"]').fill('my-test-category-2');
	await page.locator('input[name="slug"]').press('Tab');
	await page.getByRole('button', { name: 'Image' }).click();
	await page.getByRole('option', { name: 'Video' }).click();
	await page.getByRole('button', { name: 'Update Category' }).click();

	// Verify category is edited
	const editedCategoryLocator = await page
		.locator('li')
		.filter({ hasText: 'My test category should be edited' });
	await expect(editedCategoryLocator).toMatchAriaSnapshot(`
    - listitem:
      - paragraph: My test category should be edited
      - paragraph: Name
      - paragraph: This is a test description that i edited
      - paragraph: Description
      - paragraph: my-test-category-2
      - paragraph: Slug
      - paragraph: video
      - paragraph: Media Type
      - button:
        - button:
          - img
    `);

	await editedCategoryLocator.getByRole('button').nth(1).click();
	await page.getByRole('menuitem', { name: 'Delete' }).click();

	// Verify category is deleted
	await expect(editedCategoryLocator).not.toBeVisible();
});
