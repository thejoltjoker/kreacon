// Check that the entry is rendered correctly when not logged in
// No badge
// No add reaction
// No delete
// Vote should redirect to login
// Show license on hover
// Category links to correct page
// User links to correct page
// Reactions link to correct page
// Reactions should be sorted by date updated

// Check that entry is rendered correctly when logged in
// Don't Show badge
// Show add reaction
// Don't show delete
// Vote should change to voted

// Check that own entry is rendered correctly when logged in
// Show badge
// Show add reaction
// Show delete
// Vote should redirect to login
// Should show confirm on delete
import { test, expect } from '@playwright/test';

test('Single entry page not logged in', async ({ page }) => {
	// Check that the entry is rendered correctly when not logged in

	// Reactions should be sorted by date updated
	await page.goto('/entries/StrongCuriousChihuahua');
	const headerLocator = page.locator('#entry-header');

	// No badge
	// No delete
	await expect(headerLocator).toContainText('T-Rex in Morning Light');
	await expect(headerLocator).toContainText('Archeological Photography');
	await expect(headerLocator).toContainText('john_doe');
	await expect(headerLocator).toContainText('Vote');
	await expect(headerLocator.locator('.entry-delete-button')).not.toBeVisible();
	await expect(headerLocator.locator('.badge')).not.toBeVisible();

	// Category links to correct page
	const categoryLocator = headerLocator.getByRole('link', { name: 'Archeological Photography' });
	await expect(categoryLocator).toBeVisible();
	await expect(categoryLocator).toHaveAttribute('href', '/entries?category=1');

	// Show media
	await expect(page.getByRole('img', { name: 'T-Rex in Morning Light' })).toBeVisible();

	// No add reaction
	await expect(page.locator('#entry-add-reaction-button')).not.toBeVisible();
	// Show one reaction
	await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Reactions" [level=4]
    - list:
      - listitem:
        - link "alice_smith avatar 🦖":
          - img "alice_smith avatar"
          - paragraph: 🦖
    `);

	// Vote should redirect to login
	const headerVoteButton = headerLocator.getByRole('link', { name: 'Vote' });
	await expect(headerVoteButton).toBeVisible();
	await expect(headerVoteButton).toHaveAttribute(
		'href',
		'/login?redirect=/entries/StrongCuriousChihuahua'
	);

	// TODO Show license on hover
	const licenseSectionLocator = page.locator('#entry-meta-license');
	await expect(licenseSectionLocator).toBeVisible();
	await expect(licenseSectionLocator).toContainText('CC0');
	const licenseInfoButtonLocator = licenseSectionLocator.locator('.license-info-button');
	await expect(licenseInfoButtonLocator).toBeVisible();
	await licenseInfoButtonLocator.hover();
	await expect(page.getByText('CC0 Please do Public Domain')).toBeVisible();

	// Reactions link to correct page
	const reactionsSectionLocator = page.locator('#entry-reactions');
	const reactionLocator = reactionsSectionLocator.getByRole('link', {
		name: 'alice_smith avatar 🦖'
	});
	await expect(reactionLocator).toBeVisible();
	await expect(reactionLocator).toHaveAttribute('href', '/users/alice_smith/reactions');
});
test('Single entry page logged in', async ({ page }) => {
	await page.goto('/login');
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="password"]').fill('password');
	await page.getByRole('button', { name: 'Log in' }).click();
	await page.waitForURL('/profile');

	// Check that entry is rendered correctly when logged in
	await page.goto('/entries/StrongCuriousGiraffe');
	await expect(page.getByText('Gentle Giants Archeological')).toBeVisible();

	// Don't Show badge
	await expect(page.locator('.badge')).not.toBeVisible();

	// Don't show delete
	await expect(page.locator('#entry-header-actions form')).toBeVisible();
	await expect(page.locator('.entry-delete-button')).not.toBeVisible();

	// Show add reaction
	const addReactionButton = page.locator('#entry-add-reaction-button');
	await expect(addReactionButton).toBeVisible();
	// Show one reaction
	await expect(page.locator('#entry-reactions')).toMatchAriaSnapshot(`
        - heading "Reactions" [level=4]
        - list:
          - listitem:
            - button:
              - img
          - listitem:
            - link "john_doe avatar 🦕":
              - img "john_doe avatar"
              - paragraph: 🦕
        `);

	// Update reaction
	await addReactionButton.click();
	const emojiPickerLocator = page.locator('.emoji-picker');
	await expect(emojiPickerLocator).toBeVisible();
await page.getByRole('option', { name: '😊' }).click();
	await expect(page.locator('#entry-reactions')).toMatchAriaSnapshot(`
    - heading "Reactions" [level=4]
    - list:
      - listitem:
        - button:
          - img
      - listitem:
        - link "john_doe avatar 😊":
          - img "john_doe avatar"
          - paragraph: 😊
    `);

	// Vote should change to voted
	await expect(page.locator('#entry-header-actions')).toContainText('Vote');
	await expect(page.locator('#entry-actions')).toContainText('Vote');
	await page.locator('#entry-header-actions').getByRole('button', { name: 'Vote' }).click();
	await expect(page.locator('#entry-header-actions')).toContainText('Voted');
	await expect(page.locator('#entry-actions')).toContainText('Voted');
});

test('Own single entry page logged in', async ({ page }) => {
	// Check that the entry is rendered correctly when logged in
	await page.goto('/entries/StrongCuriousChihuahua');
	const headerLocator = page.locator('#entry-header');

	// Vote should redirect to login
	await headerLocator.getByRole('link', { name: 'Vote' }).click();
	await page.getByLabel('Email').fill('john.doe@example.com');
	await page.getByLabel('Password').fill('password');
	await page.getByRole('button', { name: 'Log in' }).click();

	// Check that own entry is rendered correctly when logged in
	await expect(page.url()).toContain('/entries/StrongCuriousChihuahua');

	// Show badge
	await expect(headerLocator.getByText('PUBLISHED')).toBeVisible();
	await expect(headerLocator.locator('.entry-delete-button')).toBeVisible();
	await expect(headerLocator.getByRole('button', { name: 'Vote' })).not.toBeVisible();
	const infoSectionLocator = page.locator('#entry-info');
	await expect(infoSectionLocator.locator('#entry-meta-license')).toContainText('CC0');
	await expect(infoSectionLocator.locator('#entry-actions').getByRole('link')).toBeVisible();

	await expect(infoSectionLocator.getByRole('button', { name: 'Vote' })).not.toBeVisible();

	// Show add reaction
	await expect(page.locator('#entry-add-reaction-button')).toBeVisible();

	// Show delete button with confirmation
	const deleteButton = infoSectionLocator.locator('.entry-delete-button');
	await expect(deleteButton).toBeVisible();
	await deleteButton.click();
	await expect(page.getByText('Delete entry Close')).toBeVisible();
	await expect(page.getByLabel('Delete entry')).toBeVisible();
	await page.getByRole('button', { name: 'Cancel' }).click();
	await expect(page.getByText('Delete entry Close')).not.toBeVisible();
});
