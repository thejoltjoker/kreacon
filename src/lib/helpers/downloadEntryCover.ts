export const downloadEntryCover = async (entryId: string | number): Promise<void> => {
	const response = await fetch(`/api/entries/${entryId}/cover-image`);

	if (!response.ok) {
		throw new Error(`Failed to generate cover image: ${response.statusText}`);
	}

	const blob = await response.blob();
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `entry-${entryId}-cover.png`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};
