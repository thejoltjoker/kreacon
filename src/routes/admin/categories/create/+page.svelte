<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import mime from 'mime/lite';
	import { mediaTypes } from '$lib/types/mediaTypes';
	import { t } from '$lib/i18n';
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	let { data }: { data: PageData } = $props();

	const { form, errors, enhance, message } = superForm(data.form, {
		onUpdated({ form }) {
			if (form.valid) {
				setTimeout(() => goto('/admin/categories'), 1000);
			}
		}
	});
</script>

<!-- TODO Debounce check if category with same name exists and hint user -->
{JSON.stringify($message)}

<form method="POST" use:enhance>
	<div>
		<label for="name">Category Name</label>
		<input
			type="text"
			name="name"
			bind:value={$form.name}
			aria-invalid={$errors.name ? 'true' : undefined}
		/>
		{#if $errors.name}<span class="error">{$errors.name}</span>{/if}
	</div>

	<div>
		<label for="description">Description (optional)</label>
		<textarea
			name="description"
			bind:value={$form.description}
			aria-invalid={$errors.description ? 'true' : undefined}
		></textarea>
		{#if $errors.description}<span class="error">{$errors.description}</span>{/if}
	</div>
	<div>
		<label for="mediaType">Media Type</label>
		<select
			name="mediaType"
			bind:value={$form.mediaType}
			aria-invalid={$errors.mediaType ? 'true' : undefined}
		>
			{#each mediaTypes as mediaType}
				<option value={mediaType}>{$t(mediaType)}</option>
			{/each}
		</select>
		{#if $errors.mediaType}<span class="error">{$errors.mediaType}</span>{/if}
	</div>

	<Button type="submit">Create Category</Button>
</form>

<style>
	.error {
		color: red;
		font-size: 0.875rem;
	}

	form > div {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
	}

	input,
	select,
	textarea {
		width: 100%;
		background: transparent;
		padding: 0.5rem;
	}
</style>
