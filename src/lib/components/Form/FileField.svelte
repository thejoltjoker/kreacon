<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { t } from '$lib/i18n';
	import { cn } from '$lib/utils';
	import { Label } from 'bits-ui';
	import { XCircleIcon } from 'lucide-svelte';
	import { getContext, onMount } from 'svelte';
	import type { HTMLFormAttributes, HTMLInputAttributes } from 'svelte/elements';
	import {
		fileFieldProxy,
		formFieldProxy,
		type FormFieldProxy,
		type FormPathLeaves,
		type FormPathType,
		type InputConstraint,
		type SuperForm
	} from 'sveltekit-superforms';
	import { type MediaType, type MimeType } from '$lib/types/mediaTypes';
	import { env } from '$env/dynamic/public';
	import { getExtensionsForMedia, getMimeTypesForMedia } from '$lib/helpers/mediaTypes';
	import type { Writable } from 'svelte/store';
	import { getEnctype } from './enctype.svelte';
	import AudioPlayer from '../AudioPlayer.svelte';
	import 'media-chrome';
	import snakeCase from 'lodash/snakeCase';
	import { getUrlSchema, type GetUrlSchema } from '../../../routes/api/uploads/get-url/schema';

	// TODO Default file type

	type BaseFileFieldProps = Omit<HTMLInputAttributes, 'accept' | 'type'> & {
		label: string;
		field: FormPathLeaves<T>;
		mediaType: MediaType;
		labelProps?: Label.RootProps;
		maxFileSize?: number;
		/**
		 * Optional SuperForm instance. If not provided, will attempt to get from GenericForm context
		 * Must be provided if used outside of GenericForm
		 * @default undefined
		 */
		superform?: SuperForm<T>;
	};

	type StandardBehaviorProps = BaseFileFieldProps & {
		behavior: 'standard';
	};

	type ManagedBehaviorProps = BaseFileFieldProps & {
		behavior: 'managed' | 'auto';
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
	let progress = $state(0);
	let mode = $derived(
		behavior === 'auto' ? (typeof $form[field] === 'string' ? 'managed' : 'standard') : behavior
	);
	let accept: MimeType[] = $derived(getMimeTypesForMedia(mediaType));
	let extensions = $derived(getExtensionsForMedia(mediaType));

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

{#snippet audioPreview(url: string)}
	<AudioPlayer {url} />
{/snippet}

{#snippet videoPreview(url: string)}
	<div class="flex h-full w-full flex-col gap-xs">
		<media-controller class="h-full">
			<video slot="media" src={url} crossOrigin="" playsInline class="h-full w-full">
				<track label="English" kind="captions" srcLang="en" src="./captions.vtt" />
				<track label="thumbnails" default kind="metadata" src="./thumbnails.vtt" />
			</video>
			<media-control-bar>
				<media-play-button></media-play-button>
				<media-mute-button></media-mute-button>
				<media-time-range></media-time-range>
				<media-time-display></media-time-display>
				<media-fullscreen-button></media-fullscreen-button>
			</media-control-bar>
		</media-controller>
	</div>
{/snippet}

{#snippet imagePreview(url: string, filename: string, label: string)}
	<div class="grid h-full">
		<div
			class="col-[1] row-[1] flex items-center justify-center overflow-hidden rounded-lg text-2xl font-bold text-white transition-colors"
		>
			{filename}
		</div>
		<div class="col-[1] row-[1] h-full w-full overflow-hidden rounded-lg blur-sm">
			<img
				src={url}
				alt={`${label} preview`}
				class="rounded-lg object-contain object-center opacity-20"
			/>
		</div>
	</div>
{/snippet}

<div class="flex h-full w-full flex-col gap-xs">
	<Label.Root for={field} {...labelProps} class={cn('font-bold', labelProps?.class)}>
		{label}
	</Label.Root>
	{#if files && files instanceof FileList && files.length > 0}
		<div class="debug flex flex-col items-center justify-center overflow-hidden">
			{#if mediaType === 'audio' && filePreview}
				{@render audioPreview(filePreview)}
			{:else if mediaType === 'image' && filePreview}
				{@render imagePreview(filePreview, files[0].name, label)}
			{:else if mediaType === 'video' && filePreview}
				{@render videoPreview(filePreview)}
			{/if}
		</div>
	{:else}
		<div
			role="presentation"
			id="drop_zone"
			class={cn(
				'flex h-full flex-col items-center justify-center rounded-form border-2 border-dashed border-shade-600 transition',
				isDragging && 'border-primary bg-squid-950/25 !text-white'
			)}
			ondrop={onFileDrop}
			ondragover={onDragOver}
			ondragleave={onDragOut}
		>
			{#if isDragging}
				<p class="text-2xl font-bold text-white">Let go to add your file</p>
			{:else}
				<p class="text-shade-300">
					<button
						type="button"
						onclick={chooseFile}
						class="text-2xl font-bold text-white transition-colors hover:text-primary"
					>
						{$t('Drag and drop or click to upload')}
					</button>
				</p>
			{/if}
			<p class="text-shade-300">
				{`${$t('Supported file types')}: ${extensions.join(', ')}`}
			</p>
		</div>
	{/if}
	<div class="flex items-center justify-between">
		{#if files && files instanceof FileList && files.length > 0}
			<button
				type="button"
				onclick={chooseFile}
				class="text-shade-300 transition-colors hover:text-white"
			>
				{`${$t('Browse for a different file')}`}
			</button>
			<button
				type="button"
				onclick={handleRemove}
				class="text-destructive transition-colors hover:text-pomodoro-400"
			>
				{`${$t('Remove file')}`}
			</button>
		{:else}
			<p class="text-sm text-shade-300">
				{`${$t('Supported file types')}: ${extensions.join(', ')}`}, {`${$t('Max size')} ${maxFileSize / 1024 / 1024} MB`}
			</p>
			<button type="button" onclick={chooseFile} class="text-white">
				{`${$t('Browse')}`}
			</button>
		{/if}
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

<div>
	{progress}%
	<input type="file" />
</div>
