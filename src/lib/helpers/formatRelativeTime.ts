export function formatRelativeTime(date: Date): string {
	const currentDate = new Date();
	const diffInSeconds = Math.floor((currentDate.getTime() - date.getTime()) / 1000);

	let value: number;
	let unit: Intl.RelativeTimeFormatUnit;

	if (diffInSeconds < 60) {
		value = diffInSeconds;
		unit = 'second';
	} else if (diffInSeconds < 3600) {
		value = Math.floor(diffInSeconds / 60);
		unit = 'minute';
	} else if (diffInSeconds < 86400) {
		value = Math.floor(diffInSeconds / 3600);
		unit = 'hour';
	} else if (diffInSeconds < 604800) {
		value = Math.floor(diffInSeconds / 86400);
		unit = 'day';
	} else if (diffInSeconds < 2629800) {
		value = Math.floor(diffInSeconds / 604800);
		unit = 'week';
	} else if (diffInSeconds < 31557600) {
		value = Math.floor(diffInSeconds / 2629800);
		unit = 'month';
	} else {
		value = Math.floor(diffInSeconds / 31557600);
		unit = 'year';
	}

	const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	return formatter.format(-value, unit);
}
