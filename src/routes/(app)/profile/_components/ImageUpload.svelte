<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { SignalZero, UploadIcon } from 'lucide-svelte';

	export let imageUrl: string | null = null;
	export let setImageUrl: (url: string) => void;

	let dragOverClasses = '';
	let fileInput: HTMLInputElement;

	const onDragOver = (event: DragEvent) => {
		event.stopPropagation();
		event.preventDefault();
		dragOverClasses = 'bg-gray-100';
	};
	const onDragOut = (event: DragEvent) => {
		event.stopPropagation();
		event.preventDefault();
		dragOverClasses = '';
	};

	const onFileChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			handleFile(input.files[0]);
		}
		dragOverClasses = '';
	};

	const onFileDrop = (event: DragEvent) => {
		event.preventDefault();
		const input = event.dataTransfer;
		if (input?.files && input.files.length > 0) {
			handleFile(input.files[0]);
		}
		dragOverClasses = '';
	};

	const handleFile = (file: File) => {
		if (file.type.match('image.*')) {
			const reader = new FileReader();
			reader.onload = (event) => {
				imageUrl = event.target?.result as string;
				setImageUrl(event.target?.result as string);
			};
			reader.readAsDataURL(file);

			// TODO Add to image form
			// imageForm.patchValue({ image: file.name });
			uploadFile(file);
		} else {
			throw new Error('Invalid file type, only images allowed');
		}
		dragOverClasses = '';
	};

	const uploadFile = (file: File) => {
		const formData = new FormData();
		formData.append('image', file, file.name);
		// TODO Upload image
		// imagesService.upload(formData).subscribe((image) => {
		// 	image = image;
		// 	imageUploaded.emit(image);
		// });
	};

	const chooseFile = () => {
		fileInput.click();
	};

	const handleRemove = () => {
		imageUrl = '';
		// imageForm.patchValue({ image: '' });
		dragOverClasses = '';
		setImageUrl('');
		// imageUploaded.emit(null);
	};
</script>

<form class="flex flex-col items-center gap-sm">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<button
		id="drop_zone"
		class="group relative size-48 h-48 w-48 cursor-pointer overflow-hidden rounded-full border border-white"
		on:drop={onFileDrop}
		on:dragover={onDragOver}
		on:dragleave={onDragOut}
		on:click={chooseFile}
	>
		<UploadIcon
			class="absolute left-1/2 top-1/2 z-10 size-6 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity group-hover:opacity-100"
		/>
		<img
			src={imageUrl}
			alt=""
			class="h-full w-full object-cover transition group-hover:opacity-50"
		/>
	</button>

	<!-- <div
			id="drop_zone"
			class={`flex min-h-64 flex-col items-center justify-center border-2 border-dashed border-gray-400 ${dragOverClasses}`}
			on:drop={onFileDrop}
			on:dragover={onDragOver}
			on:dragleave={onDragOut}
		>
			{#if dragOverClasses}
				<p class="text-gray-500">Let go to add your file</p>
				<p class="text-xs text-gray-300">Supports .jpg, .jpeg, .png</p>
			{:else}
				<p class="text-gray-500">
					Drop your image here, or <label for="file-input" class="font-bold text-red-600"
						>browse</label
					>
				</p>
				<p class="text-xs text-gray-300">Supports .jpg, .jpeg, .png</p>
			{/if}
		</div> -->
	<input
		bind:this={fileInput}
		type="file"
		name="file-input"
		id="file-input"
		on:change={onFileChange}
		accept="image/png, image/jpeg"
		class="hidden"
	/>
	{#if imageUrl}
		<Button onclick={handleRemove}>Remove profile image</Button>
	{:else}
		<Button onclick={chooseFile}>Browse</Button>
	{/if}
</form>
