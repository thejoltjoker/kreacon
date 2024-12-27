import { DateFormatter } from '@internationalized/date';

export const formatDateRange = (start: Date, end: Date, locale: string): string => {
	const formatter = new DateFormatter(locale, {
		dateStyle: 'medium'
	});

	return formatter.formatRange(start, end);
};
