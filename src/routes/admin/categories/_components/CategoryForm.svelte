<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import DumbSelect from '$lib/components/Form/DumbSelect.svelte';
	import type {
		CreateCategory,
		createCategorySchema,
		updateCategorySchema
	} from '$lib/server/db/schema/category';
	import { mediaTypes } from '$lib/types/mediaTypes';
	import startCase from 'lodash/startCase';

	import { t } from 'svelte-i18n';
	import { superForm } from 'sveltekit-superforms';
	import type { Infer, SuperValidated } from 'sveltekit-superforms/client';

	let {
		data
	}: {
		data: SuperValidated<Infer<typeof updateCategorySchema>>;
	} = $props();

	const { form, errors, enhance, message } = superForm(data);
</script>

<form method="POST" use:enhance class="flex flex-col gap-xl">
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

	{#if $form.slug}
		<DumbInput
			hint="A slug is a unique identifier for the category. It will be used to generate the URL for the category."
			name="slug"
			labelProps={{ class: 'text-xl' }}
			type="text"
			aria-invalid={$errors.slug ? 'true' : undefined}
			errors={$errors.slug}
			label="Slug"
			bind:value={$form.slug}
		/>
	{/if}
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
</style>
