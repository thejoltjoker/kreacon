<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { env } from '$env/dynamic/public';
	import { getExtensionsForMedia, getMimeTypesForMedia } from '$lib/helpers/mediaTypes';
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

	// TODO Default file type

	type BaseFileFieldProps = Omit<HTMLInputAttributes, 'accept' | 'type'> & {
		label: string;
		field: FormPathLeaves<T>;
		mediaType: MediaType;
		labelProps?: Label.RootProps;
		maxFileSize?: number;
		behavior?: 'standard' | 'managed' | 'auto';
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

	let fileInput: HTMLInputElement | null = $state(null);
	let files: FileList | undefined = $state();
	let isDragging = $state(false);
	let progress = $state(30);
	let mode = $derived(
		behavior === 'auto' ? (typeof $form[field] === 'string' ? 'managed' : 'standard') : behavior
	);
	let accept: MimeType[] = $derived(getMimeTypesForMedia(mediaType));
	let extensions = $derived(getExtensionsForMedia(mediaType));
	let currentState: 'idle' | 'ready' | 'uploading' | 'complete' | 'error' = $state('idle');
	let enctype = getEnctype();

	let superFieldProxy;
	if (
		behavior === 'auto' ? (typeof $form[field] === 'string' ? 'managed' : 'standard') : behavior
	) {
		superFieldProxy = formFieldProxy(superform, field);
	} else {
		superFieldProxy = fileFieldProxy(superform, field);
	}
	const { value, errors, constraints } = superFieldProxy;

	let filePreview = $derived(
		$value && $value instanceof FileList && $value.length > 0
			? URL.createObjectURL($value[0] as Blob)
			: null
	);

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

	const onFileDrop = (event: DragEvent) => {
		event.preventDefault();
		const input = event.dataTransfer;
		if (input?.files && input.files.length > 0) {
			$value = input.files;
		}
		isDragging = false;
	};

	const chooseFile = () => {
		fileInput?.click();
		if (mode === 'standard') {
			currentState = 'ready';
		}
	};

	const handleRemove = () => {
		isDragging = false;
		$value = undefined as unknown as FileList;
	};

	const getUploadUrl = async (file: File) => {
		const data: GetUrlSchema = {
			container: 'uploads',
			name: `${crypto.randomUUID()}_${snakeCase(file.name)}`,
			type: file.type
		};

		const parsed = getUrlSchema.parse(data);

		const response = await fetch(`${env.PUBLIC_BASE_URL}/api/uploads/get-url`, {
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
		const sas = await getUploadUrl(file);
		try {
			await uploadFile(sas.url, file);
			onUploadComplete?.(sas.id);
		} catch (error) {
			console.error(error);
		}
	};

	$effect(() => {
		if (mode === 'standard') enctype.set('multipart/form-data');
	});

	$effect(() => {
		if (mode === 'standard' && files != null) $value = files;
	});
</script>

<!-- TODO Make separate component -->
{#snippet dropZone()}
	<div
		role="presentation"
		ondragover={onDragOver}
		ondragend={onDragOut}
		ondrop={onFileDrop}
		class={cn(
			'grid rounded-form border border-shade-600 transition-colors hover:bg-shade-900',
			(isDragging || currentState === 'uploading') && 'border-primary',
			currentState === 'complete' && 'border-white',
			currentState === 'error' && 'border-destructive'
		)}
	>
		<div class="z-10 col-[1] row-[1] flex items-center gap-sm p-sm">
			<div
				class={cn(
					'thumbnail hidden size-form min-h-form min-w-form items-center justify-center overflow-hidden rounded-sm bg-shade-700 text-shade-400 md:flex',
					currentState === 'ready' && 'text-white',
					currentState === 'uploading' && 'bg-shade-950/50 text-primary',
					currentState === 'complete' && 'text-white',
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
					<p class="text-sm text-shade-300">Drop anywhere</p>
				{:else if currentState === 'idle'}
					<p class="hidden font-bold text-white sm:block">
						Drag and drop here or browse for a file
					</p>
					<p class="font-bold text-white sm:hidden">Browse for a file</p>
					<p class="text-sm text-shade-300">No file chosen</p>
				{:else if currentState === 'ready'}
					<p class="font-bold text-white">{files?.[0]?.name ?? 'Unknown'}</p>
					<p class="text-sm text-shade-300">
						{mode === 'standard'
							? `${Math.round((files?.[0]?.size ?? 0) / 1024 / 1024)} MB`
							: $t('Ready to upload')}
					</p>
				{:else if currentState === 'uploading'}
					<p class="font-bold text-white">{files?.[0]?.name ?? 'Unknown'}</p>
					<p class="text-sm text-shade-300" aria-live="polite">
						Uploading... {progress}%
					</p>
				{:else if currentState === 'complete'}
					<p class="font-bold text-white">{files?.[0]?.name ?? 'Unknown'}</p>
					<p class="text-sm text-shade-300">Upload complete</p>
				{:else if currentState === 'error'}
					<p class="font-bold text-white">{files?.[0]?.name ?? 'Unknown'}</p>
					<p class="text-sm text-shade-300">Upload failed</p>
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
			<div class="relative col-[1] row-[1] h-full overflow-hidden rounded-form">
				<progress
					class="progress absolute left-0 top-0 z-0 h-full w-full bg-transparent"
					max="100"
					value={progress}
					aria-label="Upload progress"
				>
				</progress>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex h-full w-full flex-col gap-xs">
	<Label.Root for={field} {...labelProps} class={cn('font-bold', labelProps?.class)}>
		{label}
	</Label.Root>

	{@render dropZone()}

	<div class="flex justify-between">
		<p class="text-sm text-shade-300">
			{`${$t('Supported file types')}: ${extensions.join(', ')}`}
		</p>
		<p class="text-sm text-shade-300">Max. 1GB</p>
	</div>
	{#if $errors}
		<ul class="flex flex-col gap-xs text-sm">
			{#each $errors as error}
				<li class="inline-flex items-center gap-2xs">
					<XCircleIcon class="size-4 text-destructive" />
					{error}
				</li>
			{/each}
		</ul>
	{/if}

	{#if mode === 'managed'}
		<input
			bind:this={fileInput}
			bind:files
			aria-invalid={$errors ? 'true' : undefined}
			accept={accept.join(', ')}
			type="file"
			name={field + '-file'}
			id={field + '-file'}
			hidden
			{...props}
			onchange={(event) => handleFileChange(event)}
		/>
		<input type="text" name={field} id={field} {...$constraints} />
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
	progress {
		-webkit-appearance: none;
		appearance: none;
	}

	progress::-webkit-progress-bar {
		@apply bg-transparent;
	}

	progress::-webkit-progress-value {
		@apply bg-squid-950 transition-all duration-200;
	}

	progress::-moz-progress-bar {
		@apply bg-squid-950 transition-all duration-200;
	}
</style>
