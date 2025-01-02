export const isBetweenDates = (date: Date, startDate: Date, endDate: Date) => {
	return date >= startDate && date <= endDate;
};
