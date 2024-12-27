import { describe, it, expect } from 'vitest';
import { formatDateRange } from './formatDateRange';

describe('formatDateRange', () => {
	describe('same month and year', () => {
		const startDate = new Date('2024-03-15');
		const endDate = new Date('2024-03-20');

		it('formats correctly in en-US', () => {
			expect(formatDateRange(startDate, endDate, 'en-US')).toBe('Mar 15 – 20, 2024');
		});

		it('formats correctly in sv-SE', () => {
			expect(formatDateRange(startDate, endDate, 'sv-SE')).toBe('15–20 mars 2024');
		});
	});

	describe('different months same year', () => {
		const startDate = new Date('2024-03-28');
		const endDate = new Date('2024-04-05');

		it('formats correctly in en-US', () => {
			expect(formatDateRange(startDate, endDate, 'en-US')).toBe('Mar 28 – Apr 5, 2024');
		});

		it('formats correctly in sv-SE', () => {
			expect(formatDateRange(startDate, endDate, 'sv-SE')).toBe('28 mars–5 apr. 2024');
		});
	});

	describe('different years', () => {
		const startDate = new Date('2023-12-28');
		const endDate = new Date('2024-01-05');

		it('formats correctly in en-US', () => {
			expect(formatDateRange(startDate, endDate, 'en-US')).toBe('Dec 28, 2023 – Jan 5, 2024');
		});

		it('formats correctly in sv-SE', () => {
			expect(formatDateRange(startDate, endDate, 'sv-SE')).toBe('28 dec. 2023–5 jan. 2024');
		});
	});
});
