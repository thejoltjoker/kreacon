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
	import { fileFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
	import { type MediaType, type MimeType } from '$lib/types/mediaTypes';
	import { env } from '$env/dynamic/public';
	import { getExtensionsForMedia, getMimeTypesForMedia } from '$lib/helpers/mediaTypes';
	import type { Writable } from 'svelte/store';
	import { getEnctype } from './enctype.svelte';
	import AudioPlayer from '../AudioPlayer.svelte';
	import 'media-chrome';
	// TODO Default file type

	interface FileFieldProps extends Omit<HTMLInputAttributes, 'accept' | 'type'> {
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
	}

	let {
		superform,
		field,
		labelProps,
		label,
		mediaType,
		maxFileSize = Number(env.PUBLIC_MAX_UPLOAD_SIZE) || 10 * 1024 * 1024,
		...props
	}: FileFieldProps = $props();

	if (superform == null) {
		superform = getContext<SuperForm<T>>('superform');
		if (superform == null) {
			throw new Error('Failed to load form context');
		}
	}
	const { value, errors, constraints } = fileFieldProxy(superform, field);
	let isDragging = $state(false);
	let fileInput: HTMLInputElement | null = $state(null);

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

	let accept: MimeType[] = $derived(getMimeTypesForMedia(mediaType));
	// let extensions = $derived(accept.flatMap((m) => Array.from(mime.getAllExtensions(m) || [])));
	let extensions = $derived(getExtensionsForMedia(mediaType));

	let enctype = getEnctype();
	onMount(() => {
		enctype.set('multipart/form-data');
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
	{#if $value && $value instanceof FileList && $value.length > 0}
		<div class="debug flex flex-col items-center justify-center overflow-hidden">
			{#if mediaType === 'audio' && filePreview}
				{@render audioPreview(filePreview)}
			{:else if mediaType === 'image' && filePreview}
				{@render imagePreview(filePreview, $value[0].name, label)}
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
		{#if $value && $value instanceof FileList && $value.length > 0}
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
	<input
		bind:this={fileInput}
		bind:files={$value as FileList}
		aria-invalid={$errors ? 'true' : undefined}
		accept={accept.join(', ')}
		type="file"
		name={field}
		id={field}
		hidden
		{...$constraints}
		{...props}
	/>
</div>
