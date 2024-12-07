<script lang="ts">
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import kebabCase from 'lodash/kebabCase';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import Button from '$lib/components/Button.svelte';

	let { data }: { data: PageData } = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.eventForm);
	let slug = $derived(kebabCase($form.name));
</script>

<div class="flex w-full max-w-screen-md flex-col gap-xl py-xl">
	<SuperDebug data={$form} />
	{#if $message}<h3>{$message}</h3>{/if}
	<form method="POST" use:enhance class="flex flex-col gap-xl">
		<DumbInput
			label="Name"
			type="text"
			name="name"
			aria-invalid={$errors.name ? 'true' : undefined}
			bind:value={$form.name}
			{...$constraints.name}
		/>
		{#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
		<DumbInput
			label="Slug"
			type="text"
			name="slug"
			aria-invalid={$errors.slug ? 'true' : undefined}
			disabled
			value={slug}
			errors={$errors.slug}
			{...$constraints.slug}
		/>
		{#if $errors.slug}<span class="invalid">{$errors.slug}</span>{/if}

		<DumbInput
			label="Description"
			type="textarea"
			name="description"
			aria-invalid={$errors.description ? 'true' : undefined}
			bind:value={$form.description}
			{...$constraints.description}
		/>
		{#if $errors.description}<span class="invalid">{$errors.description}</span>{/if}

		<div><Button type="submit">Submit</Button></div>
	</form>
</div>

<style>
	.invalid {
		color: red;
	}
</style>
