export const uploadToAzure = async (
	file: File,
	sasUrl: string,
	onProgress?: (progress: number) => void
): Promise<string> => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable && onProgress) {
				const percentComplete = (event.loaded / event.total) * 100;
				onProgress(percentComplete);
			}
		};

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(sasUrl.split('?')[0]);
			} else {
				reject(new Error(`Upload failed: ${xhr.statusText}`));
			}
		};

		xhr.onerror = () => {
			reject(new Error('Upload failed due to network error'));
		};

		xhr.open('PUT', sasUrl, true);
		xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
		xhr.setRequestHeader('Content-Type', file.type);
		xhr.send(file);
	});
};
