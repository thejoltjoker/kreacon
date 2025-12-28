<!-- TODO Add transition to progress bar -->
<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { env } from '$env/dynamic/public';
	import {
		getExtensionsForMedia,
		getMimeTypesForMedia,
		isAllowedMimeTypeForMedia
	} from '$lib/helpers/mediaTypes';
	import { t } from '$lib/i18n';
	import { type MediaType, type MimeType } from '$lib/types/mediaTypes';
	import { cn } from '$lib/utils';
	import { Label } from 'bits-ui';
	import snakeCase from 'lodash/snakeCase';
	import {
		CheckCircle2Icon,
		FileIcon,
		FolderOpenIcon,
		LoaderCircleIcon,
		RefreshCcwIcon,
		TrashIcon,
		UploadIcon,
		XCircleIcon,
		XIcon
	} from 'lucide-svelte';
	import 'media-chrome';
	import { getContext } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import {
		fileFieldProxy,
		formFieldProxy,
		type FormPathLeaves,
		type SuperForm
	} from 'sveltekit-superforms';
	import { getUrlSchema, type GetUrlSchema } from '../../../routes/api/uploads/get-url/schema';
	import Button from '../Button.svelte';
	import { getEnctype } from './enctype.svelte';
	import { fileTypeFromBlob } from 'file-type';

	// TODO Default file type

	type BaseFileFieldProps = Omit<HTMLInputAttributes, 'accept' | 'type'> & {
		label: string;
		field: FormPathLeaves<T>;
		mediaType: MediaType;
		labelProps?: Label.RootProps;
		maxFileSize?: number;
		behavior?: 'standard' | 'managed' | 'auto';
		debug?: boolean;
		customUploadUrl?: string;
		/**
		 * Optional SuperForm instance. If not provided, will attempt to get from GenericForm context
		 * Must be provided if used outside of GenericForm
		 * @default undefined
		 */
		superform?: SuperForm<T>;
	};

	type StandardBehaviorProps = BaseFileFieldProps & {
		behavior?: 'standard';
	};

	type ManagedBehaviorProps = BaseFileFieldProps & {
		behavior?: 'managed' | 'auto';
		/**
		 * Optional callback when upload completes in managed mode
		 * @param fileId The database ID of the uploaded file
		 */
		onUploadComplete?: (fileId: string) => void;
	};

	type FileFieldProps = StandardBehaviorProps | ManagedBehaviorProps;

	let {
		superform,
		field,
		labelProps,
		label,
		mediaType,
		behavior = 'auto',
		maxFileSize = Number(env.PUBLIC_MAX_UPLOAD_SIZE) || 10 * 1024 * 1024,
		debug = false,
		customUploadUrl,
		...props
	}: FileFieldProps = $props();

	const onUploadComplete = (props as ManagedBehaviorProps).onUploadComplete;

	if (superform == null) {
		superform = getContext<SuperForm<T>>('superform');
		if (superform == null) {
			throw new Error('Failed to load form context');
		}
	}
	const { form } = superform;

	let fileInput: HTMLInputElement | undefined = $state();
	let files: FileList | null | undefined = $state();
	let isDragging = $state(false);
	let progress = $state(0);
	let mode = $state(
		behavior === 'auto'
			? customUploadUrl != null || typeof $form[field] === 'string'
				? 'managed'
				: 'standard'
			: behavior === 'managed'
				? 'managed'
				: 'standard'
	);
	let accept: MimeType[] = $derived(getMimeTypesForMedia(mediaType));
	let extensions = $derived(getExtensionsForMedia(mediaType));
	let currentState: 'idle' | 'ready' | 'uploading' | 'complete' | 'error' = $state('idle');
	let enctype = getEnctype();
	let xhr: XMLHttpRequest | undefined = $state();
	let blobUrl: string | undefined = $state();
	let uploadUrl: string | undefined = $state(customUploadUrl);
	let fileId: string = $state(crypto.randomUUID());
	let validationError: string | undefined = $state();

	let superFieldProxy;
	if (
		behavior === 'auto'
			? customUploadUrl != null || typeof $form[field] === 'string'
				? true
				: false
			: behavior === 'managed'
				? true
				: false
	) {
		superFieldProxy = formFieldProxy(superform, field);
	} else {
		superFieldProxy = fileFieldProxy(superform, field);
	}
	const { value, errors, constraints } = superFieldProxy;

	// let filePreview = $derived(
	// 	$value && $value instanceof FileList && $value.length > 0
	// 		? URL.createObjectURL($value[0] as Blob)
	// 		: null
	// );

	const onDragOver = (event: DragEvent) => {
		event.stopPropagation();
		event.preventDefault();
		isDragging = true;
	};
	const onDragOut = (event: DragEvent) => {
		event.stopPropagation();
		event.preventDefault();
		isDragging = false;
	};

	async function validateFile(file: File): Promise<boolean> {
		const fileType = await fileTypeFromBlob(file);

		if (!fileType) {
			validationError = `Unable to determine file type. Please upload a valid ${mediaType} file.`;
			return false;
		}

		if (!isAllowedMimeTypeForMedia(fileType.mime, mediaType)) {
			validationError = `Invalid file type. Expected ${mediaType} file, but got ${fileType.mime}. Supported types: ${extensions.join(', ')}`;
			return false;
		}

		validationError = undefined;
		return true;
	}

	async function processFiles() {
		if (!files || files.length === 0) return;

		const file = files[0];

		const isValid = await validateFile(file);
		if (!isValid) {
			currentState = 'error';
			return;
		}

		currentState = 'uploading';

		// TODO Generate checksum
		if (uploadUrl == null) {
			const sas = await getUploadUrl(file);
			fileId = sas.fileId;
			blobUrl = sas.url;
			uploadUrl = sas.url;
		}

		try {
			await uploadFile(uploadUrl, file);
			onUploadComplete?.(fileId);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			$value = fileId as any; //TODO Fix proper types
			currentState = 'complete';
		} catch (error) {
			console.error(error);
			validationError = 'Upload failed. Please try again.';
			currentState = 'error';
		}
	}

	const onFileDrop = async (event: DragEvent) => {
		event.preventDefault();
		isDragging = false;
		const input = event.dataTransfer;

		if (input?.files && input.files.length > 0) {
			files = input.files;

			const isValid = await validateFile(files[0]);
			if (!isValid) {
				currentState = 'error';
				return;
			}

			if (mode === 'standard') {
				$value = input.files;
				currentState = 'ready';
			} else {
				await processFiles();
			}
		}
	};

	const chooseFile = () => {
		fileInput?.click();
		if (mode === 'standard') {
			currentState = 'ready';
		}
	};

	const deleteBlob = async (url: string) => {
		await fetch(url, {
			method: 'DELETE'
		});
	};
	const handleRemove = () => {
		xhr?.abort();
		if (mode === 'managed' && blobUrl != null) {
			deleteBlob(blobUrl);
			blobUrl = undefined;
		}
		reset();
	};

	const reset = () => {
		files = undefined;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		$value = mode === 'standard' ? (undefined as unknown as FileList) : ('' as any);
		currentState = 'idle';
		progress = 0;
		uploadUrl = customUploadUrl;
		fileId = crypto.randomUUID();
		validationError = undefined;
	};

	const getBlobName = async (file: File) => {
		const result = await fileTypeFromBlob(file);
		if (result == null) {
			throw new Error('Failed to identify file type');
		}
		const { ext } = result;
		return `${fileId}_${snakeCase(file.name)}.${ext}`;
	};

	const getUploadUrl = async (file: File) => {
		const result = await fileTypeFromBlob(file);
		if (result == null) {
			throw new Error('Failed to identify file type');
		}
		const { mime } = result;
		const data: GetUrlSchema = {
			uuid: fileId,
			container: 'uploads',
			name: await getBlobName(file),
			type: mime,
			size: file.size
		};

		const parsed = getUrlSchema.parse(data);

		const response = await fetch(`${env.PUBLIC_BASE_URL ?? ''}/api/uploads/get-url`, {
			method: 'POST',
			body: JSON.stringify(parsed)
		});

		const responseData: { url: string; fileId: string } = await response.json();

		return responseData;
	};

	const uploadFile = async (url: string, file: File): Promise<void> => {
		const blobName = await getBlobName(file);

		return new Promise((resolve, reject) => {
			xhr = new XMLHttpRequest();
			xhr.open('PUT', url, true);
			xhr.setRequestHeader('Content-Type', file.type);
			xhr.setRequestHeader('x-file-id', fileId);
			xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
			xhr.setRequestHeader('x-ms-blob-name', blobName);
			xhr.setRequestHeader('x-ms-version', '2020-04-08');

			xhr.upload.onprogress = (event) => {
				progress = Math.floor((event.loaded / event.total) * 100);
			};

			xhr.onload = () => {
				if (xhr == null) return;
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

			xhr.send(file);
		});
	};

	const handleFileChange = async (
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		files = event.currentTarget.files;
		if (!files || files.length === 0) return;

		const isValid = await validateFile(files[0]);
		if (!isValid) {
			currentState = 'error';
			return;
		}

		if (mode === 'managed') {
			await processFiles();
		}
	};

	$effect(() => {
		if (mode === 'standard') enctype.set('multipart/form-data');
	});

	$effect(() => {
		if (mode === 'standard' && files != null) $value = files;
	});
</script>

{#snippet debugView()}
	<div class="rounded-form bg-shade-800 p-sm font-mono">
		<p class="text-shade-400"># state</p>
		<p><span class="text-tertiary">blobUrl:</span> {blobUrl ?? typeof blobUrl}</p>
		<p><span class="text-tertiary">uploadUrl:</span> {uploadUrl ?? typeof uploadUrl}</p>
		<p><span class="text-tertiary">fileId:</span> {fileId ?? typeof fileId}</p>
		<p><span class="text-tertiary">currentState:</span> {currentState ?? typeof currentState}</p>
		<p><span class="text-tertiary">isDragging:</span> {isDragging ?? typeof isDragging}</p>
		<p>
			<span class="text-tertiary">fileInput:</span>
			{JSON.stringify(fileInput) ?? typeof fileInput}
		</p>
		<p><span class="text-tertiary">files:</span> {JSON.stringify(files) ?? typeof files}</p>
		<p><span class="text-tertiary">progress:</span> {progress ?? typeof progress}</p>
		<p><span class="text-tertiary">value:</span> {JSON.stringify($value) ?? typeof $value}</p>
		<p><span class="text-tertiary">xhr:</span> {xhr ?? typeof xhr}</p>
		<p>
			<span class="text-tertiary">validationError:</span>
			{validationError ?? typeof validationError}
		</p>

		<p class="text-shade-400"># props</p>
		<p><span class="text-tertiary">behavior:</span> {behavior ?? typeof behavior}</p>
		<p><span class="text-tertiary">maxFileSize:</span> {maxFileSize ?? typeof maxFileSize}</p>

		<p class="text-shade-400"># derived</p>
		<p><span class="text-tertiary">accept:</span> {JSON.stringify(accept)}</p>
		<p><span class="text-tertiary">extensions:</span> {JSON.stringify(extensions)}</p>
		<p><span class="text-tertiary">mode:</span> {mode ?? typeof mode}</p>
	</div>
{/snippet}

{#if debug}
	{@render debugView()}
{/if}
<!-- TODO Make separate component -->
{#snippet dropZone()}
	<div
		role="presentation"
		ondrop={onFileDrop}
		ondragover={onDragOver}
		ondragleave={onDragOut}
		class={cn(
			'rounded-form border-shade-600 hover:bg-shade-900 grid border transition-colors',
			isDragging && 'border-primary bg-primary/10',
			currentState === 'uploading' && 'border-primary',
			currentState === 'complete' && 'border-white',
			currentState === 'error' && 'border-destructive'
		)}
	>
		<div class="gap-sm p-sm z-10 col-1 row-1 flex items-center">
			<div
				class={cn(
					'thumbnail size-form min-h-form min-w-form bg-shade-700 text-shade-400 hidden items-center justify-center overflow-hidden rounded-sm md:flex',
					currentState === 'ready' && 'text-white',
					currentState === 'uploading' && 'bg-shade-950/50 text-primary',
					currentState === 'complete' && 'text-success',
					currentState === 'error' && 'text-destructive'
				)}
			>
				{#if currentState === 'idle'}
					<UploadIcon />
				{:else if currentState === 'ready'}
					<FileIcon />
				{:else if currentState === 'uploading'}
					<LoaderCircleIcon class="animate-spin" />
				{:else if currentState === 'complete'}
					<CheckCircle2Icon />
				{:else if currentState === 'error'}
					<XCircleIcon />
				{/if}
			</div>
			<div class="flex flex-col">
				{#if isDragging}
					<p class="font-bold text-white">Let go to start uploading</p>
					<p class="text-shade-300 text-sm">Drop anywhere</p>
				{:else if currentState === 'idle'}
					<p class="hidden font-bold text-white sm:block">
						Drag and drop here or browse for a file
					</p>
					<p class="font-bold text-white sm:hidden">Browse for a file</p>
					<p class="text-shade-300 text-sm">No file chosen</p>
				{:else if currentState === 'ready'}
					<p class="font-bold text-white">{files?.[0]?.name ?? 'Unknown'}</p>
					<p class="text-shade-300 text-sm">
						{mode === 'standard'
							? `${((files?.[0]?.size ?? 0) / 1024 / 1024).toFixed(2)} MB`
							: $t('Ready to upload')}
					</p>
				{:else if currentState === 'uploading'}
					<p class="font-bold text-white">{files?.[0]?.name ?? 'Unknown'}</p>
					<p class="text-shade-300 text-sm" aria-live="polite">
						{#if progress === 100}
							Processing...
						{:else}
							Uploading... {progress}%
						{/if}
					</p>
				{:else if currentState === 'complete'}
					<p class="font-bold text-white">{files?.[0]?.name ?? 'Unknown'}</p>
					<p class="text-shade-300 text-sm">Upload complete</p>
				{:else if currentState === 'error'}
					<p class="font-bold text-white">{files?.[0]?.name ?? 'Unknown'}</p>
					<p class="text-destructive text-sm">{validationError ?? 'Upload failed'}</p>
				{/if}
			</div>
			<div class={cn('ml-auto', isDragging && 'hidden')}>
				{#if currentState === 'complete'}
					<Button variant="outline" size="icon" onclick={handleRemove}>
						<TrashIcon />
					</Button>
				{:else if currentState === 'uploading' || currentState === 'ready'}
					<Button variant="outline" size="icon" onclick={handleRemove}>
						<XIcon />
					</Button>
				{:else if currentState === 'error'}
					<Button variant="outline" class="hidden sm:block" onclick={chooseFile}>
						{$t('Try again')}
					</Button>
					<Button variant="outline" size="icon" class="sm:hidden" onclick={chooseFile}>
						<RefreshCcwIcon />
					</Button>
				{:else}
					<Button variant="outline" class="hidden sm:block" onclick={chooseFile}>
						{$t('Browse...')}
					</Button>
					<Button variant="outline" size="icon" class="sm:hidden" onclick={chooseFile}>
						<FolderOpenIcon />
					</Button>
				{/if}
			</div>
		</div>
		{#if currentState === 'uploading'}
			<div class="rounded-form relative col-1 row-1 h-full overflow-hidden">
				<progress
					class="progress absolute top-0 left-0 z-0 h-full w-full bg-transparent"
					max="100"
					value={progress}
					aria-label="Upload progress"
				>
				</progress>
			</div>
		{/if}
	</div>
{/snippet}

<div class="gap-xs flex h-full w-full flex-col">
	<Label.Root for={field} {...labelProps} class={cn('font-bold', labelProps?.class)}>
		{label}
	</Label.Root>

	{@render dropZone()}

	<div class="flex justify-between">
		<p class="text-shade-300 text-sm">
			{`${$t('Supported file types')}: ${extensions.join(', ')}`}
		</p>
		<p class="text-shade-300 text-sm">Max. {maxFileSize / 1024 / 1024} MB</p>
	</div>
	{#if $errors || validationError}
		<ul class="gap-xs flex flex-col text-sm">
			{#if validationError}
				<li class="gap-2xs inline-flex items-center">
					<XCircleIcon class="text-destructive size-4" />
					{validationError}
				</li>
			{/if}
			{#if $errors}
				{#each $errors as error, i (i)}
					<li class="gap-2xs inline-flex items-center">
						<XCircleIcon class="text-destructive size-4" />
						{error}
					</li>
				{/each}
			{/if}
		</ul>
	{/if}

	<!-- Hidden input elements -->
	{#if mode === 'managed'}
		<input
			bind:this={fileInput}
			bind:files
			aria-invalid={$errors ? 'true' : undefined}
			accept={accept.join(', ')}
			type="file"
			name={field + '-file'}
			id={field + '-file'}
			{...props}
			onchange={(event) => handleFileChange(event)}
			hidden
			form={Date.now().toString()}
		/>
		<input
			type="text"
			name={field}
			id={field}
			value={$value}
			class="bg-black text-white"
			hidden
			{...$constraints}
		/>
	{:else}
		<input
			bind:this={fileInput}
			bind:files={files as FileList}
			aria-invalid={$errors ? 'true' : undefined}
			accept={accept.join(', ')}
			type="file"
			name={field}
			id={field}
			hidden
			{...$constraints}
			{...props}
		/>
	{/if}
</div>

<style lang="postcss">
	@reference "../../../app.css";

	progress {
		-webkit-appearance: none;
		appearance: none;
		@apply transition-all;
	}

	progress::-webkit-progress-bar {
		@apply bg-transparent transition-all;
	}

	progress::-webkit-progress-value {
		@apply bg-squid-950 transition-all duration-200;
	}

	progress::-moz-progress-bar {
		@apply bg-squid-950 transition-all duration-200;
	}
</style>
