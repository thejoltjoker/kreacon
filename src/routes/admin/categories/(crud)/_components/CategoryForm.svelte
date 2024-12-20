<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import DumbSelect from '$lib/components/Form/DumbSelect.svelte';
	import { getAllowedExtensions } from '$lib/helpers/mediaTypes';
	import { createCategorySchema } from '$lib/server/db/schema/category';
	import { MediaTypes, type MediaType } from '$lib/types/mediaTypes';
	import startCase from 'lodash/startCase';

	import { t } from 'svelte-i18n';
	import { superForm } from 'sveltekit-superforms';
	import type { Infer, SuperValidated } from 'sveltekit-superforms/client';

	let {
		data
	}: {
		data: SuperValidated<Infer<typeof createCategorySchema>>;
	} = $props();

	const { form, errors, enhance, message } = superForm(data);
</script>

<form method="POST" use:enhance class="flex w-full flex-col items-center gap-xl">
	{JSON.stringify($message)}
	<DumbInput
		name="name"
		labelProps={{ class: 'text-xl' }}
		type="text"
		aria-invalid={$errors.name ? 'true' : undefined}
		errors={$errors.name}
		label="Name"
		bind:value={$form.name}
	/>

	<DumbInput
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
			hint="Short, unique identifier for the category."
			name="slug"
			labelProps={{ class: 'text-xl' }}
			type="text"
			aria-invalid={$errors.slug ? 'true' : undefined}
			errors={$errors.slug}
			label="Slug"
			bind:value={$form.slug}
		/>
	{/if}
	<div class="flex w-full flex-col gap-sm">
		<label class="mb-0 text-xl font-bold" for="mediaType">Media Type</label>
		<DumbSelect
			class="w-full"
			placeholder="Select Media Type"
			name="mediaType"
			type="single"
			bind:value={$form.mediaType}
			items={MediaTypes.map((mediaType) => ({ value: mediaType, label: startCase($t(mediaType)) }))}
		/>
		{#if $form.mediaType}
			<p class="text-shade-400">
				Allowed {$form.mediaType} file types {getAllowedExtensions($form.mediaType as MediaType)
					.map((extension) => `.${extension}`)
					.join(', ')}
			</p>
		{/if}
		{#if $errors.mediaType}<span class="error">{$errors.mediaType}</span>{/if}
	</div>

	<Button type="submit">
		{#if $page.url.pathname.endsWith('/edit')}
			Update Category
		{:else}
			Create Category
		{/if}
	</Button>
</form>
