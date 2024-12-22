<script lang="ts">
	import snakeCase from 'lodash/snakeCase';
	import { getUrlSchema, type GetUrlSchema } from '../../../../api/uploads/get-url/schema';

	let progress = $state(0);
	const getUploadUrl = async (file: File) => {
		const data: GetUrlSchema = {
			container: 'uploads',
			name: `${crypto.randomUUID()}_${snakeCase(file.name)}`,
			type: file.type
		};

		const parsed = getUrlSchema.parse(data);

		const response = await fetch('/api/uploads/get-url', {
			method: 'POST',
			body: JSON.stringify(parsed)
		});
		return await response.json();
	};

	const uploadFile = async (url: string, file: File) => {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.open('PUT', url, true);
			xhr.setRequestHeader('Content-Type', file.type);
			xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
			xhr.setRequestHeader('x-ms-version', '2020-04-08');

			xhr.upload.onprogress = (event) => {
				progress = Math.floor((event.loaded / event.total) * 100);
			};

			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					progress = 100;
					resolve(xhr.response);
				} else {
					reject(new Error(`Upload failed with status ${xhr.status}`));
				}
			};

			xhr.onerror = () => {
				reject(new Error('Upload failed'));
			};

			xhr.onabort = () => {
				reject(new Error('Upload aborted'));
			};

			xhr.send(file);
		});
	};

	const handleFileChange = async (
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		const file = event.currentTarget.files?.[0];
		if (!file) return;
		// TODO Generate checksum
		// TODO Send file metadata to get sas url
		const sas = await getUploadUrl(file);
		console.log(sas);
		const uploaded = await uploadFile(sas.url, file);
		console.log(uploaded);
	};
</script>

<div>
	{progress}%
	<input type="file" onchange={(event) => handleFileChange(event)} />
</div>
