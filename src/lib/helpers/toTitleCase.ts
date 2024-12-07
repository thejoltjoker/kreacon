export const toTitleCase = (str: string): string => {
	const withSpaces = str.replace(/[-_]/g, ' ');

	const spacedStr = withSpaces
		.replace(/([A-Z])/g, ' $1')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		.trim();

	return spacedStr
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
