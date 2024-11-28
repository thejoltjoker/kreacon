<script lang="ts" generics="T extends Record<string, unknown>">
	import {
		fileFieldProxy,
		fileProxy,
		formFieldProxy,
		type SuperForm
	} from 'sveltekit-superforms/client';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';

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

	let dragOverClasses = $state('');
	let displayImage = $state('');
	let fileInput: HTMLInputElement | null = $state(null);
	let className = $derived(
		cn(
			'flex min-h-64 flex-col items-center justify-center border-2 border-dashed border-gray-400',
			dragOverClasses
		)
	);
	const onDragOver = (event: DragEvent) => {
		event.stopPropagation();
		event.preventDefault();
		dragOverClasses = 'bg-muted-background';
	};
	const onDragOut = (event: DragEvent) => {
		event.stopPropagation();
		event.preventDefault();
		dragOverClasses = '';
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
		dragOverClasses = '';
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
		displayImage = '';
		// imageForm.patchValue({ image: '' });
		dragOverClasses = '';
		// imageUploaded.emit(null);
	};

	$effect(() => {
		console.log('file', $value);
	});
</script>

{#if displayImage}
	<img src={displayImage} alt="" class="min-h-32 w-full" />
{/if}

{#if !displayImage}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		role="presentation"
		id="drop_zone"
		class={className}
		ondrop={onFileDrop}
		ondragover={onDragOver}
		ondragleave={onDragOut}
	>
		{#if dragOverClasses}
			<p class="text-gray-500">Let go to add your file</p>
			<p class="text-xs text-gray-300">Supports .jpg, .jpeg, .png</p>
		{:else}
			<p class="text-gray-500">
				Drop your image here, or <label for="file-input" class="font-bold text-red-600">
					browse
				</label>
			</p>
			<p class="text-xs text-gray-300">Supports .jpg, .jpeg, .png</p>
		{/if}
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
	{#if displayImage}
		<div class="mt-md flex justify-between gap-sm">
			<button onclick={handleRemove}>Remove</button>
		</div>
	{:else}
		<button onclick={chooseFile}>Browse</button>
	{/if}
{/if}
<!-- <input type="file" name={field} bind:value={$value} {...$constraints} {disabled} /> -->
<!-- TODO Display errors -->
{$errors}
