<script lang="ts">
	import CategoryForm from '../_components/CategoryForm.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	// const { form, errors, enhance, message } = superForm(data.form, {
	// 	onUpdated({ form }) {
	// 		if (form.valid) {
	// 			setTimeout(() => goto('/admin/categories'), 1000);
	// 		}
	// 	}
	// });
</script>

<!-- TODO Debounce check if category with same name exists and hint user -->
<div class="flex w-full max-w-screen-md p-sm md:p-xl">
	<CategoryForm data={data.form} />
</div>
<!-- <form method="POST" use:enhance class="flex flex-col gap-xl">
	{JSON.stringify($message)}
	<DumbInput
		hint="This is the name of the category. Try something short and descriptive."
		name="name"
		labelProps={{ class: 'text-xl' }}
		type="text"
		aria-invalid={$errors.name ? 'true' : undefined}
		errors={$errors.name}
		label="Name"
		bind:value={$form.name}
	/>

	<DumbInput
		hint="This is the description of the category. It will be used to describe the category in the system."
		name="description"
		labelProps={{ class: 'text-xl' }}
		type="textarea"
		aria-invalid={$errors.description ? 'true' : undefined}
		errors={$errors.description}
		label="Description"
		bind:value={$form.description}
	/>
	<div class="flex w-full flex-col">
		<label class="mb-0 text-xl font-bold" for="mediaType">Media Type</label>
		<p class=" text-shade-400">
			Select the type of media that this category is for. This will be used to filter media in the
			system.
		</p>
		<DumbSelect
			class="w-full"
			placeholder="Select Media Type"
			name="mediaType"
			type="single"
			bind:value={$form.mediaType}
			items={mediaTypes.map((mediaType) => ({ value: mediaType, label: startCase($t(mediaType)) }))}
		/>
		{#if $errors.mediaType}<span class="error">{$errors.mediaType}</span>{/if}
	</div>

	<Button type="submit">Create Category</Button>
</form>

<style>
	.error {
		color: red;
		font-size: 0.875rem;
	}
</style> -->
