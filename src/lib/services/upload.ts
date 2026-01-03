import * as Sentry from '@sentry/sveltekit';

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
				const error = new Error(`Upload failed: ${xhr.statusText}`);
				const errorContext = {
					status: xhr.status,
					statusText: xhr.statusText,
					responseText: xhr.responseText,
					responseURL: xhr.responseURL,
					file,
					sasUrl
				};
				console.error('[FileUpload] Upload failed (onload):', errorContext);
				Sentry.captureException(error, {
					tags: { component: 'uploadToAzure', errorType: 'upload-failed', httpStatus: xhr.status },
					extra: {
						file: { name: file.name, size: file.size, type: file.type },
						sasUrl,
						response: {
							status: xhr.status,
							statusText: xhr.statusText,
							responseText: xhr.responseText,
							responseURL: xhr.responseURL
						}
					}
				});
				reject(error);
			}
		};

		xhr.onerror = () => {
			const error = new Error('Upload failed due to network error');
			const errorContext = {
				status: xhr.status,
				statusText: xhr.statusText,
				readyState: xhr.readyState,
				file,
				sasUrl
			};
			console.error('[FileUpload] Upload failed (onerror):', errorContext);
			Sentry.captureException(error, {
				tags: { component: 'uploadToAzure', errorType: 'upload-network-error' },
				extra: {
					file: { name: file.name, size: file.size, type: file.type },
					sasUrl,
					xhr: { status: xhr.status, statusText: xhr.statusText, readyState: xhr.readyState }
				}
			});
			reject(error);
		};

		xhr.onabort = () => {
			const error = new Error('Upload aborted');
			console.error('[FileUpload] Upload aborted:', { file, sasUrl });
			Sentry.captureException(error, {
				tags: { component: 'uploadToAzure', errorType: 'upload-aborted' },
				extra: { file: { name: file.name, size: file.size, type: file.type }, sasUrl }
			});
			reject(error);
		};

		xhr.open('PUT', sasUrl, true);
		xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
		xhr.setRequestHeader('Content-Type', file.type);
		xhr.send(file);
	});
};
