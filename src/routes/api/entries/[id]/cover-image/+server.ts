import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { chromium } from '@playwright/test';
import { createBackendLogger } from '$lib/server/logger';
import { StatusCodes } from 'http-status-codes';
import { createPublicUrl } from '$lib/utils';
import { adminCheck } from '../../../../admin/utils';

const logger = createBackendLogger('api/entries/[id]/cover-image');

export const GET: RequestHandler = async ({ params, locals }) => {
	adminCheck(locals);
	const { id } = params;

	logger.info(`Generating cover image for entry ID: ${id}`);

	let browser;
	let page;
	try {
		browser = await chromium.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});

		page = await browser.newPage({
			viewport: { width: 1920, height: 768 }
		});

		const coverUrl = createPublicUrl(`/entries/${id}/cover`);
		logger.info(`Navigating to cover URL: ${coverUrl}`);

		await page.goto(coverUrl, {
			waitUntil: 'networkidle',
			timeout: 30000
		});

		await page.waitForSelector('#letterbox', { timeout: 10000 });

		await page.waitForTimeout(2000);

		const element = await page.$('#letterbox');
		const screenshot = await element!.screenshot({
			type: 'png',
			omitBackground: false
		});

		logger.info(`Successfully generated cover image for entry ID: ${id}`);

		return new Response(screenshot as BodyInit, {
			headers: {
				'Content-Type': 'image/png',
				'Content-Disposition': `attachment; filename="entry-${id}-cover.png"`,
				'Cache-Control': 'public, max-age=3600'
			}
		});
	} catch (err) {
		logger.error('Failed to generate cover image', { error: err, entryId: id });
		throw error(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to generate cover image');
	} finally {
		if (page) {
			await page.close().catch((err) => {
				logger.warn('Error closing page', { error: err });
			});
		}
		if (browser) {
			await browser.close();
		}
	}
};
