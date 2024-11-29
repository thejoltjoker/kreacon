import { promises as fs } from 'fs';
import path from 'path';

export const saveFile = async (file: File) => {
	// TODO Save file to static/uploads folder
	const uploadsDir = path.resolve('static/uploads');
	const mediaPath = path.join(uploadsDir, file.name);
	const relativeMediaPath = path.join('/uploads', file.name);

	try {
		await fs.mkdir(uploadsDir, { recursive: true });
		const arrayBuffer = await file.arrayBuffer();
		await fs.writeFile(mediaPath, new Uint8Array(arrayBuffer));
		console.log(`File saved to ${mediaPath}`);
		return relativeMediaPath;
	} catch (err) {
		console.error('Error saving file:', err);
		throw err;
	}
};
