<script lang="ts" generics="T extends Record<string, unknown>">
	import {
		fileFieldProxy,
		fileProxy,
		formFieldProxy,
		type SuperForm
	} from 'sveltekit-superforms/client';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';
	import Button from '../Button.svelte';

	interface Props {
		// eslint-disable-next-line no-undef
		form: SuperForm<T>;
		// eslint-disable-next-line no-undef
		field: FormPathLeaves<T>;
		disabled: boolean;
	}

	const { form, field, disabled }: Props = $props();
	// const { value, errors, constraints } = formFieldProxy(form, field);
	const { value, errors, constraints } = fileFieldProxy(form, field);

	let isDragging = $state(false);
	let filePreview = $state<string | null>(null);
	let fileInput: HTMLInputElement | null = $state(null);
	// TODO Make drop zone a component
	let dropZoneClassName = $derived(
		cn(
			'flex min-h-[30vh] aspect-square flex-col items-center justify-center border-2 border-dashed border-muted-foreground rounded-form transition',
			isDragging && 'bg-squid-950/25 border-primary !text-white'
		)
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

	// const onFileChange = (event: Event) => {
	// 	const input = event.target as HTMLInputElement;
	// 	if (input.files && input.files.length > 0) {
	// 		handleFile(input.files[0]);
	// 	}
	// 	dragOverClasses = '';
	// };

	const onFileDrop = (event: DragEvent) => {
		event.preventDefault();
		const input = event.dataTransfer;
		if (input?.files && input.files.length > 0) {
			$value = input.files;
		}
		isDragging = false;
	};

	// const handleFile = (file: File) => {
	// 	if (file.type.match('image.*')) {
	// 		fileInput?.files?.add(file);
	// 		// const reader = new FileReader();
	// 		// reader.onload = (event) => {
	// 		// 	displayImage = event.target?.result as string;
	// 		// };
	// 		// reader.readAsDataURL(file);

	// 		// TODO Add to image form
	// 	} else {
	// 		throw new Error('Invalid file type, only images allowed');
	// 	}
	// 	dragOverClasses = '';
	// };

	const chooseFile = () => {
		fileInput?.click();
	};

	const handleRemove = () => {
		filePreview = '';
		// imageForm.patchValue({ image: '' });
		isDragging = false;
		// imageUploaded.emit(null);
	};

	// $effect(() => {
	// 	console.log('file', $value);
	// 	if ($value instanceof FileList && $value.length > 0) {
	// 		const reader = new FileReader();
	// 		reader.onload = (e) => {
	// 			filePreview = e.target?.result as string;
	// 		};
	// 		reader.readAsDataURL($value[0]);
	// 	} else if ($value instanceof File) {
	// 		const reader = new FileReader();
	// 		reader.onload = (e) => {
	// 			filePreview = e.target?.result as string;
	// 		};
	// 		reader.readAsDataURL($value);
	// 	}
	// });
</script>

{#if filePreview != null}
	<div
		class="border-muted-foreground flex items-center justify-center overflow-hidden rounded-form border"
	>
		<div class="overflow-hidden rounded-lg">
			<img src={filePreview} alt="" class="h-full w-full rounded-lg object-contain" />
		</div>
	</div>
{/if}

{#if !filePreview}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
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
				Drop your image here, or <button
					type="button"
					onclick={chooseFile}
					class="decoration-secondary font-bold text-white underline"
				>
					browse
				</button>
			</p>
		{/if}
		<p class="text-muted-background-alt text-sm">Supports .jpg, .jpeg, .png</p>
	</div>
	<input
		bind:this={fileInput}
		bind:files={$value as FileList}
		type="file"
		accept="image/png, image/jpeg"
		class="hidden"
		name={field}
		{disabled}
	/>
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
<!-- <input type="file" name={field} bind:value={$value} {...$constraints} {disabled} /> -->
<!-- TODO Display errors -->
{$errors}
