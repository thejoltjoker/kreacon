import type { SelectEvent } from '$lib/server/db/schema/event';

export type EventStatus = 'submitting' | 'voting' | 'scheduled' | 'closed';

export function getEventStatus(event: SelectEvent): EventStatus {
	const now = new Date();
	if (now >= event.submissionsOpenAt && now <= event.submissionsCloseAt) {
		return 'submitting';
	}
	if (now >= event.votingOpenAt && now <= event.votingCloseAt) {
		return 'voting';
	}
	if (now >= event.votingCloseAt && now >= event.submissionsCloseAt) {
		return 'closed';
	}
	return 'scheduled';
}
