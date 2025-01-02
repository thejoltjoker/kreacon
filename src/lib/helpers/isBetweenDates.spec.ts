import { describe, it, expect } from 'vitest';
import { isBetweenDates } from './isBetweenDates';

describe('isBetweenDates', () => {
	it('should return true if the date and time is between startDate and endDate', () => {
		const date = new Date('2023-10-15T12:00:00');
		const startDate = new Date('2023-10-01T00:00:00');
		const endDate = new Date('2023-10-31T23:59:59');
		expect(isBetweenDates(date, startDate, endDate)).toBe(true);
	});

	it('should return false if the date and time is before startDate', () => {
		const date = new Date('2023-10-01T00:00:00');
		const startDate = new Date('2023-10-01T12:00:00');
		const endDate = new Date('2023-10-31T23:59:59');
		expect(isBetweenDates(date, startDate, endDate)).toBe(false);
	});

	it('should return false if the date and time is after endDate', () => {
		const date = new Date('2023-10-31T23:59:59');
		const startDate = new Date('2023-10-01T00:00:00');
		const endDate = new Date('2023-10-31T12:00:00');
		expect(isBetweenDates(date, startDate, endDate)).toBe(false);
	});

	it('should return true if the date and time is exactly the startDate', () => {
		const date = new Date('2023-10-01T12:00:00');
		const startDate = new Date('2023-10-01T12:00:00');
		const endDate = new Date('2023-10-31T23:59:59');
		expect(isBetweenDates(date, startDate, endDate)).toBe(true);
	});

	it('should return true if the date and time is exactly the endDate', () => {
		const date = new Date('2023-10-31T23:59:59');
		const startDate = new Date('2023-10-01T00:00:00');
		const endDate = new Date('2023-10-31T23:59:59');
		expect(isBetweenDates(date, startDate, endDate)).toBe(true);
	});
});
