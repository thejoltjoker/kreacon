<script lang="ts">
	let dragOverClasses = '';
	let displayImage = '';
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
				displayImage = event.target?.result as string;
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
		displayImage = '';
		// imageForm.patchValue({ image: '' });
		dragOverClasses = '';
		// imageUploaded.emit(null);
	};
</script>

{#if displayImage}
	<img src={displayImage} alt="" class="min-h-32 w-full" />
{/if}

<form class="gap-sm flex flex-col">
	{#if !displayImage}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
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
		</div>
		<input
			bind:this={fileInput}
			type="file"
			name="file-input"
			id="file-input"
			on:change={onFileChange}
			accept="image/png, image/jpeg"
			class="hidden"
		/>
		{#if displayImage}
			<div class="mt-md gap-sm flex justify-between">
				<button on:click={handleRemove}>Remove</button>
			</div>
		{:else}
			<button on:click={chooseFile}>Browse</button>
		{/if}
	{/if}
</form>
