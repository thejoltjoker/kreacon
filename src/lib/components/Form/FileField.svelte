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

<div class="flex h-full w-full flex-col gap-xs">
	<Label.Root for={field} {...labelProps} class={cn('font-bold', labelProps?.class)}>
		{label}
	</Label.Root>
	{#if $value && $value instanceof FileList && $value.length > 0}
		<div
			class="grid h-full items-center justify-center overflow-hidden rounded-form border border-muted-foreground"
		>
			<div
				class="col-[1] row-[1] overflow-hidden rounded-lg text-center text-2xl font-bold text-white transition-colors"
			>
				{$value[0].name}
			</div>
			<div class="col-[1] row-[1] overflow-hidden rounded-lg blur-sm">
				<img
					src={filePreview}
					alt={`${label} preview`}
					class="h-full w-full rounded-lg object-contain opacity-20"
				/>
			</div>
		</div>
	{:else}
		<div
			role="presentation"
			id="drop_zone"
			class={cn(
				'flex h-full flex-col items-center justify-center rounded-form border-2 border-dashed border-muted-foreground transition',
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
