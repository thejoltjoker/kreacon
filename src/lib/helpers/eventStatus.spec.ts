import { describe, it, expect, vi } from 'vitest';
import { getEventStatus } from './eventStatus';
import type { SelectEvent } from '$lib/server/db/schema/event';

describe('getEventStatus', () => {
	const baseEvent: SelectEvent = {
		id: 1,
		name: 'Test Event',
		description: 'Test Description',
		slug: 'test-event',
		submissionsOpenAt: new Date('2024-01-01T00:00:00Z'),
		submissionsCloseAt: new Date('2024-01-02T00:00:00Z'),
		votingOpenAt: new Date('2024-01-03T00:00:00Z'),
		votingCloseAt: new Date('2024-01-04T00:00:00Z'),
		createdAt: new Date(),
		updatedAt: new Date()
	};

	it('returns "submitting" when current time is within submission period', () => {
		const now = new Date('2024-01-01T12:00:00Z');
		vi.setSystemTime(now);

		const status = getEventStatus(baseEvent);
		expect(status).toBe('submitting');
	});

	it('returns "voting" when current time is within voting period', () => {
		const now = new Date('2024-01-03T12:00:00Z');
		vi.setSystemTime(now);

		const status = getEventStatus(baseEvent);
		expect(status).toBe('voting');
	});

	it('returns "scheduled" when current time is before submission period', () => {
		const now = new Date('2023-12-31T12:00:00Z');
		vi.setSystemTime(now);

		const status = getEventStatus(baseEvent);
		expect(status).toBe('scheduled');
	});

	it('returns "scheduled" when current time is between submission and voting periods', () => {
		const now = new Date('2024-01-02T12:00:00Z');
		vi.setSystemTime(now);

		const status = getEventStatus(baseEvent);
		expect(status).toBe('scheduled');
	});

	it('returns "scheduled" when current time is after voting period', () => {
		const now = new Date('2024-01-04T12:00:00Z');
		vi.setSystemTime(now);

		const status = getEventStatus(baseEvent);
		expect(status).toBe('scheduled');
	});
});

describe('getEventStatus with overlapping periods', () => {
	const overlappingEvent: SelectEvent = {
		id: 1,
		name: 'Overlapping Event',
		description: 'Test Description',
		slug: 'overlapping-event',
		submissionsOpenAt: new Date('2024-01-01T00:00:00Z'),
		submissionsCloseAt: new Date('2024-01-03T12:00:00Z'),
		votingOpenAt: new Date('2024-01-02T00:00:00Z'),
		votingCloseAt: new Date('2024-01-04T00:00:00Z'),
		createdAt: new Date(),
		updatedAt: new Date()
	};

	it('returns "submitting" when in overlapping period but before voting starts', () => {
		const now = new Date('2024-01-01T12:00:00Z');
		vi.setSystemTime(now);

		const status = getEventStatus(overlappingEvent);
		expect(status).toBe('submitting');
	});

	it('returns "submitting" when in overlapping period', () => {
		const now = new Date('2024-01-02T12:00:00Z');
		vi.setSystemTime(now);

		const status = getEventStatus(overlappingEvent);
		expect(status).toBe('submitting');
	});

	it('returns "voting" when submission period ended but voting still active', () => {
		const now = new Date('2024-01-03T13:00:00Z');
		vi.setSystemTime(now);

		const status = getEventStatus(overlappingEvent);
		expect(status).toBe('voting');
	});
});
