import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { formatRelativeTime } from './formatRelativeTime';

describe('formatRelativeTime', () => {
	let baseDate: Date;

	beforeEach(() => {
		baseDate = new Date('2024-03-20T12:00:00Z');
		vi.setSystemTime(baseDate);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('formats seconds ago', () => {
		const date = new Date(baseDate.getTime() - 45 * 1000); // 45 seconds ago
		expect(formatRelativeTime(date)).toBe('45 seconds ago');
	});

	it('formats minutes ago', () => {
		const date = new Date(baseDate.getTime() - 5 * 60 * 1000); // 5 minutes ago
		expect(formatRelativeTime(date)).toBe('5 minutes ago');
	});

	it('formats hours ago', () => {
		const date = new Date(baseDate.getTime() - 3 * 3600 * 1000); // 3 hours ago
		expect(formatRelativeTime(date)).toBe('3 hours ago');
	});

	it('formats days ago', () => {
		const date = new Date(baseDate.getTime() - 2 * 86400 * 1000); // 2 days ago
		expect(formatRelativeTime(date)).toBe('2 days ago');
	});

	it('formats weeks ago', () => {
		const date = new Date(baseDate.getTime() - 3 * 604800 * 1000); // 3 weeks ago
		expect(formatRelativeTime(date)).toBe('3 weeks ago');
	});

	it('formats months ago', () => {
		const date = new Date(baseDate.getTime() - 2 * 2629800 * 1000); // 2 months ago
		expect(formatRelativeTime(date)).toBe('2 months ago');
	});

	it('formats years ago', () => {
		const date = new Date(baseDate.getTime() - 2 * 31557600 * 1000); // 2 years ago
		expect(formatRelativeTime(date)).toBe('2 years ago');
	});
});
