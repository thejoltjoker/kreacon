<script lang="ts" generics="T extends Record<string, unknown>">
	import { fileFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';
	import Button from '../Button.svelte';
	import type { MediaType } from '$lib/types/mediaTypes';
	import { mimeFromMediaType } from '$lib/helpers/mimeFromMediaType';
	import { t } from '$lib/i18n';

	interface Props {
		// eslint-disable-next-line no-undef
		form: SuperForm<T>;
		// eslint-disable-next-line no-undef
		field: FormPathLeaves<T>;
		disabled: boolean;
		mediaType?: MediaType;
	}

	const { form, field, disabled, mediaType = 'image' }: Props = $props();
	const { value, errors, constraints } = fileFieldProxy(form, field);

	let isDragging = $state(false);

	let fileInput: HTMLInputElement | null = $state(null);
	// TODO Make drop zone a component
	let dropZoneClassName = $derived(
		cn(
			'flex min-h-[30vh] aspect-square flex-col items-center justify-center border-2 border-dashed border-muted-foreground rounded-form transition',
			isDragging && 'bg-squid-950/25 border-primary text-white!'
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
</script>

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
			<p class="text-white">Let go to add your file</p>
		{:else}
			<p class="text-muted-foreground-alt">
				<button
					type="button"
					onclick={chooseFile}
					class="text-2xl font-bold text-white underline decoration-secondary"
				>
					{$t('Click here to upload a file')}
				</button>
			</p>
		{/if}
		<p class="text-muted-foreground-alt">
			{$t('Max. 1GB. Images, Audio or Video.')}
		</p>
	</div>
{/if}
{#if filePreview != null}
	<div class="mt-md flex justify-between gap-sm">
		<Button variant="outline" onclick={handleRemove}>Remove</Button>
	</div>
{:else}
	<div class="mt-md flex justify-center">
		<Button variant="outline" onclick={chooseFile}>Browse</Button>
	</div>
{/if}
<input
	bind:this={fileInput}
	bind:files={$value as FileList}
	type="file"
	accept={mimeFromMediaType(mediaType)}
	hidden
	name={field}
	{disabled}
	{...$constraints}
/>
<!-- <input type="file" name={field} bind:value={$value} {...$constraints} {disabled} /> -->
<!-- TODO Display errors -->
{$errors}
