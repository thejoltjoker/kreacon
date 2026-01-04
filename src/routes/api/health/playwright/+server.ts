import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chromium } from '@playwright/test';
import { createBackendLogger } from '$lib/server/logger';

const logger = createBackendLogger('api/health/playwright');

export const GET: RequestHandler = async () => {
	try {
		logger.info('Checking Playwright installation...');
		const browser = await chromium.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});
		const version = browser.version();
		await browser.close();
		logger.info('Playwright health check passed', { version });
		return json({
			status: 'ok',
			playwright: 'installed',
			chromiumVersion: version
		});
	} catch (error) {
		logger.error('Playwright health check failed', { error });
		return json(
			{
				status: 'error',
				playwright: 'not installed or failed to launch',
				error: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	}
};
