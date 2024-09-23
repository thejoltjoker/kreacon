import { getOAuthClient, isOAuthProvider, type OAuthProvider } from '$lib/server/auth/oauth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const GET: RequestHandler = async ({ params }) => {
	const { provider } = params;
	// Authorize on provider
	// Get access token
	// Get account info
	// Store acocunt info
	// Check if user exists for account
	// If user exists, log in
	// If user does not exist, create user
	// Log in

	if (!provider) {
		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
	}

	if (!isOAuthProvider(provider)) {
		return redirect(StatusCodes.TEMPORARY_REDIRECT, '/login');
	}

	const client = getOAuthClient(provider as OAuthProvider);
	return client.authorize();
};
