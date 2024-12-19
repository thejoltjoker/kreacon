<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import mime from 'mime';
	import { t } from '$lib/i18n';
	import { cn } from '$lib/utils';
	import { Label } from 'bits-ui';
	import { XCircleIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { fileFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
	import { type MimeType } from '$lib/types/mediaTypes';
	import { env } from '$env/dynamic/public';

	interface FileFieldProps extends Omit<HTMLInputAttributes, 'accept' | 'type'> {
		label: string;
		field: FormPathLeaves<T>;
		accept: MimeType[];
		labelProps?: Label.RootProps;
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
		accept,
		class: className,
		...props
	}: FileFieldProps = $props();

	let max_upload_size = Number(env.PUBLIC_MAX_UPLOAD_SIZE) ?? 1024 * 1024 * 1024;
	if (superform == null) {
		superform = getContext<SuperForm<T>>('superform');
		if (superform == null) {
			throw new Error('Failed to load form context');
		}
	}
	const { value, errors, constraints } = fileFieldProxy(superform, field);
	let isDragging = $state(false);
	let fileInput: HTMLInputElement | null = $state(null);
	let dropZoneClassName = $derived(
		cn(
			'flex min-h-[30vh] aspect-square flex-col items-center justify-center border-2 border-dashed border-muted-foreground rounded-form transition',
			isDragging && 'bg-squid-950/25 border-primary !text-white'
		)
	);

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
	};

	let extensions = $derived(accept.flatMap((m) => Array.from(mime.getAllExtensions(m) || [])));
</script>

<div class="flex h-full w-full flex-col gap-xs">
	<Label.Root for={field} {...labelProps} class={cn('font-bold', labelProps?.class)}>
		{label}
	</Label.Root>
	{#if $value && $value instanceof FileList && $value.length > 0}
		<div
			class="flex items-center justify-center overflow-hidden rounded-form border border-muted-foreground"
		>
			<div class="overflow-hidden rounded-lg">
				<img
					src={$value instanceof FileList && $value.length > 0
						? URL.createObjectURL($value[0] as Blob)
						: null}
					alt=""
					class="h-full w-full rounded-lg object-contain"
				/>
			</div>
		</div>
	{:else}
		<div
			role="presentation"
			id="drop_zone"
			class={dropZoneClassName}
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
		<div class="flex justify-between">
			<p class="text-shade-300">
				{`${$t('Supported file types')}: ${extensions.join(', ')}`}
			</p>
			<p class="text-shade-300">
				{`${$t('Max size')} ${max_upload_size / 1024 / 1024} MB`}
			</p>
		</div>
	{/if}

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
