import { test, expect } from '@playwright/test';

test('Unauthorized access to admin pages', async ({ page }) => {
	const response = await page.goto('http://localhost:4173/admin');
	await expect(response?.status()).toBe(401);
});

import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
	await page.goto('http://localhost:4173/login');
	await page.locator('input[name="email"]').fill('john.doe@example.com');
	await page.locator('input[name="password"]').fill('password');
	await page.getByRole('button', { name: 'Login' }).click();
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

	//   WIP
	//   await expect(page.locator('body')).toMatchAriaSnapshot(`
	//     - listitem:
	//       - button "1 Id":
	//         - paragraph: 1
	//         - paragraph: Id
	//       - button /Beacon Summer \\d+ Name/:
	//         - paragraph: /Beacon Summer \\d+/
	//         - paragraph: Name
	//       - button /beacon-summer-\\d+ Slug/:
	//         - paragraph: /beacon-summer-\\d+/
	//         - paragraph: Slug
	//       - button /Join us for an epic LAN party at Beacon Summer \\d+! Experience non-stop gaming, thrilling tournaments, cosplay contests, tech workshops, and delicious food\\. Connect with fellow gamers, win exciting prizes, and create unforgettable memories in this action-packed event\\. Description/:
	//         - paragraph: /Join us for an epic LAN party at Beacon Summer \\d+! Experience non-stop gaming, thrilling tournaments, cosplay contests, tech workshops, and delicious food\\. Connect with fellow gamers, win exciting prizes, and create unforgettable memories in this action-packed event\\./
	//         - paragraph: Description
	//       - button /\\d+ Jun \\d+, \\d+:\\d+ Submissions Open At/:
	//         - paragraph: /\\d+ Jun \\d+, \\d+:\\d+/
	//         - paragraph: Submissions Open At
	//       - button /\\d+ Jun \\d+, \\d+:\\d+ Submissions Close At/:
	//         - paragraph: /\\d+ Jun \\d+, \\d+:\\d+/
	//         - paragraph: Submissions Close At
	//       - button /\\d+ Jun \\d+, \\d+:\\d+ Voting Open At/:
	//         - paragraph: /\\d+ Jun \\d+, \\d+:\\d+/
	//         - paragraph: Voting Open At
	//       - button /\\d+ Jul \\d+, \\d+:\\d+ Voting Close At/:
	//         - paragraph: /\\d+ Jul \\d+, \\d+:\\d+/
	//         - paragraph: Voting Close At
	//       - button /\\d+ Dec \\d+, \\d+:\\d+ Created At/:
	//         - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
	//         - paragraph: Created At
	//       - button /\\d+ Dec \\d+, \\d+:\\d+ Updated At/:
	//         - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
	//         - paragraph: Updated At
	//       - button:
	//         - button:
	//           - img
	//     `);
	//   await page.getByRole('button', { name: 'Sorted by: Oldest' }).click();
	//   await page.getByRole('option', { name: 'Newest' }).click();
	//   await expect(page.locator('body')).toMatchAriaSnapshot(`
	//     - listitem:
	//       - button "4 Id":
	//         - paragraph: 4
	//         - paragraph: Id
	//       - button /LanHack Winter \\d+ Name/:
	//         - paragraph: /LanHack Winter \\d+/
	//         - paragraph: Name
	//       - button /lanhack-winter-\\d+ Slug/:
	//         - paragraph: /lanhack-winter-\\d+/
	//         - paragraph: Slug
	//       - button "Gross Description":
	//         - paragraph: Gross
	//         - paragraph: Description
	//       - button /\\d+ Nov \\d+, \\d+:\\d+ Submissions Open At/:
	//         - paragraph: /\\d+ Nov \\d+, \\d+:\\d+/
	//         - paragraph: Submissions Open At
	//       - button /\\d+ Dec \\d+, \\d+:\\d+ Submissions Close At/:
	//         - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
	//         - paragraph: Submissions Close At
	//       - button /\\d+ Nov \\d+, \\d+:\\d+ Voting Open At/:
	//         - paragraph: /\\d+ Nov \\d+, \\d+:\\d+/
	//         - paragraph: Voting Open At
	//       - button /\\d+ Dec \\d+, \\d+:\\d+ Voting Close At/:
	//         - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
	//         - paragraph: Voting Close At
	//       - button /\\d+ Dec \\d+, \\d+:\\d+ Created At/:
	//         - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
	//         - paragraph: Created At
	//       - button /\\d+ Dec \\d+, \\d+:\\d+ Updated At/:
	//         - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
	//         - paragraph: Updated At
	//       - button:
	//         - button:
	//           - img
	//     `);
	//   await page.getByPlaceholder('Search').click();
	//   await page.getByPlaceholder('Search').fill('s');
	//   await page.goto('http://localhost:4173/admin/events?sortBy=newest&q=s');
	//   await page.getByPlaceholder('Search').click();
	//   await page.getByPlaceholder('Search').fill('summe');
	//   await page.goto('http://localhost:4173/admin/events?sortBy=newest&q=summe');
	//   await page.getByPlaceholder('Search').click();
	//   await page.getByPlaceholder('Search').fill('summe');
	//   await page.goto('http://localhost:4173/admin/events?sortBy=newest&q=summe');
	//   await page.getByPlaceholder('Search').click();
	//   await page.getByPlaceholder('Search').fill('summe');
	//   await page.goto('http://localhost:4173/admin/events?sortBy=newest&q=summer');
	//   await expect(page.locator('body')).toMatchAriaSnapshot(`
	//     - list:
	//       - listitem:
	//         - button "1 Id":
	//           - paragraph: 1
	//           - paragraph: Id
	//         - button /Beacon Summer \\d+ Name/:
	//           - paragraph: /Beacon Summer \\d+/
	//           - paragraph: Name
	//         - button /beacon-summer-\\d+ Slug/:
	//           - paragraph: /beacon-summer-\\d+/
	//           - paragraph: Slug
	//         - button /Join us for an epic LAN party at Beacon Summer \\d+! Experience non-stop gaming, thrilling tournaments, cosplay contests, tech workshops, and delicious food\\. Connect with fellow gamers, win exciting prizes, and create unforgettable memories in this action-packed event\\. Description/:
	//           - paragraph: /Join us for an epic LAN party at Beacon Summer \\d+! Experience non-stop gaming, thrilling tournaments, cosplay contests, tech workshops, and delicious food\\. Connect with fellow gamers, win exciting prizes, and create unforgettable memories in this action-packed event\\./
	//           - paragraph: Description
	//         - button /\\d+ Jun \\d+, \\d+:\\d+ Submissions Open At/:
	//           - paragraph: /\\d+ Jun \\d+, \\d+:\\d+/
	//           - paragraph: Submissions Open At
	//         - button /\\d+ Jun \\d+, \\d+:\\d+ Submissions Close At/:
	//           - paragraph: /\\d+ Jun \\d+, \\d+:\\d+/
	//           - paragraph: Submissions Close At
	//         - button /\\d+ Jun \\d+, \\d+:\\d+ Voting Open At/:
	//           - paragraph: /\\d+ Jun \\d+, \\d+:\\d+/
	//           - paragraph: Voting Open At
	//         - button /\\d+ Jul \\d+, \\d+:\\d+ Voting Close At/:
	//           - paragraph: /\\d+ Jul \\d+, \\d+:\\d+/
	//           - paragraph: Voting Close At
	//         - button /\\d+ Dec \\d+, \\d+:\\d+ Created At/:
	//           - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
	//           - paragraph: Created At
	//         - button /\\d+ Dec \\d+, \\d+:\\d+ Updated At/:
	//           - paragraph: /\\d+ Dec \\d+, \\d+:\\d+/
	//           - paragraph: Updated At
	//         - button:
	//           - button:
	//             - img
	//     `);
});
