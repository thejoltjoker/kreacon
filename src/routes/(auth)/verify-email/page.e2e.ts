import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/utils';
import { expect, test } from '@playwright/test';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

const TOKEN_VALIDITY_MS = 24 * 60 * 60 * 1000;

const createVerifyEmailToken = (email: string, timestamp?: number) => {
	const ts = timestamp ?? Date.now();
	const emailVerificationSecret = process.env.EMAIL_VERIFICATION_SECRET ?? 'test-secret';
	const authString = `${emailVerificationSecret}:${email}:${ts}`;
	const token = crypto.createHash('sha256').update(authString).digest('hex');
	return { token, timestamp: ts };
};

const TEST_EMAIL = 'test.verify@example.com';
const TEST_EMAIL_VERIFIED = 'test.verified@example.com';
const TEST_EMAIL_NONEXISTENT = 'test.nonexistent@example.com';

// Setup: Create test users before all tests
test.beforeAll(async () => {
	// Clean up any existing test users
	await db.delete(users).where(eq(users.email, TEST_EMAIL));
	await db.delete(users).where(eq(users.email, TEST_EMAIL_VERIFIED));

	// Create unverified user
	await db.insert(users).values({
		email: TEST_EMAIL,
		username: 'test_verify',
		password: await hashPassword('password'),
		emailVerifiedAt: null
	});

	// Create verified user
	await db.insert(users).values({
		email: TEST_EMAIL_VERIFIED,
		username: 'test_verified',
		password: await hashPassword('password'),
		emailVerifiedAt: new Date()
	});
});

// Cleanup: Remove test users after all tests
test.afterAll(async () => {
	await db.delete(users).where(eq(users.email, TEST_EMAIL));
	await db.delete(users).where(eq(users.email, TEST_EMAIL_VERIFIED));
});

// Reset unverified user state before each test that modifies it
test.beforeEach(async () => {
	await db.update(users).set({ emailVerifiedAt: null }).where(eq(users.email, TEST_EMAIL));
});

test('Valid verification link successfully verifies email', async ({ page }) => {
	const timestamp = Date.now();
	const { token } = createVerifyEmailToken(TEST_EMAIL, timestamp);
	const encodedEmail = encodeURIComponent(TEST_EMAIL);
	const verificationUrl = `/verify-email/${encodedEmail}/${token}?t=${timestamp}`;

	// Navigate to verification URL
	const response = await page.goto(verificationUrl);

	// Should redirect to home page
	expect(response?.status()).toBe(307); // Temporary redirect
	await page.waitForURL('/');

	// Verify email was actually verified in database
	const user = await db.query.users.findFirst({
		where: eq(users.email, TEST_EMAIL)
	});
	expect(user?.emailVerifiedAt).not.toBeNull();
});

test('Expired token is rejected', async ({ page }) => {
	// Create token with timestamp that's expired (older than TOKEN_VALIDITY_MS)
	const expiredTimestamp = Date.now() - TOKEN_VALIDITY_MS - 1000; // 1 second past expiry
	const { token } = createVerifyEmailToken(TEST_EMAIL, expiredTimestamp);
	const encodedEmail = encodeURIComponent(TEST_EMAIL);
	const verificationUrl = `/verify-email/${encodedEmail}/${token}?t=${expiredTimestamp}`;

	// Navigate to verification URL
	const response = await page.goto(verificationUrl, { waitUntil: 'networkidle' });

	// Should return 401 Unauthorized
	expect(response?.status()).toBe(401);

	// Verify email was NOT verified in database
	const user = await db.query.users.findFirst({
		where: eq(users.email, TEST_EMAIL)
	});
	expect(user?.emailVerifiedAt).toBeNull();
});

test('Invalid token is rejected', async ({ page }) => {
	const timestamp = Date.now();
	const invalidToken = 'a'.repeat(64); // Invalid token of correct length
	const encodedEmail = encodeURIComponent(TEST_EMAIL);
	const verificationUrl = `/verify-email/${encodedEmail}/${invalidToken}?t=${timestamp}`;

	// Navigate to verification URL
	const response = await page.goto(verificationUrl, { waitUntil: 'networkidle' });

	// Should return 401 Unauthorized
	expect(response?.status()).toBe(401);

	// Verify email was NOT verified in database
	const user = await db.query.users.findFirst({
		where: eq(users.email, TEST_EMAIL)
	});
	expect(user?.emailVerifiedAt).toBeNull();
});

test('Token with wrong length is rejected', async ({ page }) => {
	const timestamp = Date.now();
	const shortToken = 'a'.repeat(32); // Too short
	const encodedEmail = encodeURIComponent(TEST_EMAIL);
	const verificationUrl = `/verify-email/${encodedEmail}/${shortToken}?t=${timestamp}`;

	// Navigate to verification URL
	const response = await page.goto(verificationUrl, { waitUntil: 'networkidle' });

	// Should return 401 Unauthorized
	expect(response?.status()).toBe(401);

	// Verify email was NOT verified in database
	const user = await db.query.users.findFirst({
		where: eq(users.email, TEST_EMAIL)
	});
	expect(user?.emailVerifiedAt).toBeNull();
});

test('Missing timestamp parameter is rejected', async ({ page }) => {
	const timestamp = Date.now();
	const { token } = createVerifyEmailToken(TEST_EMAIL, timestamp);
	const encodedEmail = encodeURIComponent(TEST_EMAIL);
	const verificationUrl = `/verify-email/${encodedEmail}/${token}`; // Missing ?t= parameter

	// Navigate to verification URL
	const response = await page.goto(verificationUrl, { waitUntil: 'networkidle' });

	// Should return 401 Unauthorized
	expect(response?.status()).toBe(401);
});

test('Invalid timestamp parameter is rejected', async ({ page }) => {
	const timestamp = Date.now();
	const { token } = createVerifyEmailToken(TEST_EMAIL, timestamp);
	const encodedEmail = encodeURIComponent(TEST_EMAIL);
	const verificationUrl = `/verify-email/${encodedEmail}/${token}?t=invalid`;

	// Navigate to verification URL
	const response = await page.goto(verificationUrl, { waitUntil: 'networkidle' });

	// Should return 401 Unauthorized
	expect(response?.status()).toBe(401);
});

test('Resend verification email for unverified user', async ({ page }) => {
	await page.goto('/verify-email');

	// Fill in email field
	await page.locator('input[name="email"]').fill(TEST_EMAIL);

	// Submit form
	await page.locator('button[type="submit"]').click();

	// Should show success message
	await expect(
		page.getByText('If an account with that email exists, a verification email has been sent.')
	).toBeVisible();
});

test('Resend verification email for already verified user', async ({ page }) => {
	await page.goto('/verify-email');

	// Fill in email field with verified email
	await page.locator('input[name="email"]').fill(TEST_EMAIL_VERIFIED);

	// Submit form
	await page.locator('button[type="submit"]').click();

	// Should show success message (doesn't reveal if email is verified or not)
	await expect(
		page.getByText('If an account with that email exists, a verification email has been sent.')
	).toBeVisible();
});

test('Resend verification email for non-existent user', async ({ page }) => {
	await page.goto('/verify-email');

	// Fill in email field with non-existent email
	await page.locator('input[name="email"]').fill(TEST_EMAIL_NONEXISTENT);

	// Submit form
	await page.locator('button[type="submit"]').click();

	// Should show success message (doesn't reveal if email exists or not)
	await expect(
		page.getByText('If an account with that email exists, a verification email has been sent.')
	).toBeVisible();
});

test('Already verified email can be verified again (idempotent)', async ({ page }) => {
	// First verify the email
	const timestamp1 = Date.now();
	const { token: token1 } = createVerifyEmailToken(TEST_EMAIL, timestamp1);
	const encodedEmail = encodeURIComponent(TEST_EMAIL);
	const verificationUrl1 = `/verify-email/${encodedEmail}/${token1}?t=${timestamp1}`;

	await page.goto(verificationUrl1);
	await page.waitForURL('/');

	// Verify email is now verified
	let user = await db.query.users.findFirst({
		where: eq(users.email, TEST_EMAIL)
	});
	expect(user?.emailVerifiedAt).not.toBeNull();

	// Try to verify again with a new token
	const timestamp2 = Date.now();
	const { token: token2 } = createVerifyEmailToken(TEST_EMAIL, timestamp2);
	const verificationUrl2 = `/verify-email/${encodedEmail}/${token2}?t=${timestamp2}`;

	await page.goto(verificationUrl2);
	await page.waitForURL('/');

	// Email should still be verified (idempotent operation)
	user = await db.query.users.findFirst({
		where: eq(users.email, TEST_EMAIL)
	});
	expect(user?.emailVerifiedAt).not.toBeNull();
});

test('Invalid email format in URL is rejected', async ({ page }) => {
	const timestamp = Date.now();
	const { token } = createVerifyEmailToken(TEST_EMAIL, timestamp);
	const invalidEmail = 'not-an-email';
	const verificationUrl = `/verify-email/${invalidEmail}/${token}?t=${timestamp}`;

	// Navigate to verification URL
	const response = await page.goto(verificationUrl, { waitUntil: 'networkidle' });

	// Should return 401 Unauthorized
	expect(response?.status()).toBe(401);
});

test('Future timestamp is rejected', async ({ page }) => {
	// Create token with timestamp in the future
	const futureTimestamp = Date.now() + 60000; // 1 minute in the future
	const { token } = createVerifyEmailToken(TEST_EMAIL, futureTimestamp);
	const encodedEmail = encodeURIComponent(TEST_EMAIL);
	const verificationUrl = `/verify-email/${encodedEmail}/${token}?t=${futureTimestamp}`;

	// Navigate to verification URL
	const response = await page.goto(verificationUrl, { waitUntil: 'networkidle' });

	// Should return 401 Unauthorized
	expect(response?.status()).toBe(401);

	// Verify email was NOT verified in database
	const user = await db.query.users.findFirst({
		where: eq(users.email, TEST_EMAIL)
	});
	expect(user?.emailVerifiedAt).toBeNull();
});

test('Non-existent user verification attempt is rejected', async ({ page }) => {
	const timestamp = Date.now();
	const { token } = createVerifyEmailToken(TEST_EMAIL_NONEXISTENT, timestamp);
	const encodedEmail = encodeURIComponent(TEST_EMAIL_NONEXISTENT);
	const verificationUrl = `/verify-email/${encodedEmail}/${token}?t=${timestamp}`;

	// Navigate to verification URL
	const response = await page.goto(verificationUrl, { waitUntil: 'networkidle' });

	// Should return 401 Unauthorized (user not found)
	expect(response?.status()).toBe(401);
});

test('Concurrent verification attempts with same token', async ({ page, context }) => {
	const timestamp = Date.now();
	const { token } = createVerifyEmailToken(TEST_EMAIL, timestamp);
	const encodedEmail = encodeURIComponent(TEST_EMAIL);
	const verificationUrl = `/verify-email/${encodedEmail}/${token}?t=${timestamp}`;

	// Create a second page in the same context to simulate concurrent requests
	const page2 = await context.newPage();

	try {
		// Attempt to verify the same email concurrently
		const [response1, response2] = await Promise.all([
			page.goto(verificationUrl),
			page2.goto(verificationUrl)
		]);

		// Both should succeed (idempotent operation)
		// One or both should redirect to home
		const status1 = response1?.status();
		const status2 = response2?.status();

		// At least one should succeed with a redirect
		expect(status1 === 307 || status2 === 307).toBeTruthy();

		// Verify email was verified in database
		const user = await db.query.users.findFirst({
			where: eq(users.email, TEST_EMAIL)
		});
		expect(user?.emailVerifiedAt).not.toBeNull();

		// Verify only one user was updated (defensive check from the code)
		const allUsersWithEmail = await db.query.users.findMany({
			where: eq(users.email, TEST_EMAIL)
		});
		expect(allUsersWithEmail.length).toBe(1);
	} finally {
		await page2.close();
	}
});
