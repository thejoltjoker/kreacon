<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { updateUserSchema } from '$lib/schemas/user';
	import { Label } from 'bits-ui';
	import { XCircleIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import ImageUpload from './_components/ImageUpload.svelte';
	import { page } from '$app/stores';

	const user = $derived($page.data.user);

	interface PageProps {
		data: import('./$types').PageData;
		imageUrl: string;
	}

	let { data, imageUrl }: PageProps = $props();

	const { form, errors, message, enhance, constraints } = superForm(data.form, {
		validators: zodClient(updateUserSchema),
		invalidateAll: 'force'
	});

	imageUrl = $derived(user?.picture ?? 'https://placehold.co/100x100');

	const setImageUrl = (url: string) => {
		imageUrl = url;
	};

	const handleFile = (file: File) => {
		if (file.type.match('image.*')) {
			const reader = new FileReader();
			reader.onload = (event) => {
				imageUrl = event.target?.result as string;
			};
			reader.readAsDataURL(file);
		} else {
			throw new Error('Invalid file type, only images allowed');
		}
	};

	export const onFileChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			handleFile(input.files[0]);
		}
	};
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>
<div class="w-full p-sm">
	{#if $message}<h3>{$message}</h3>{/if}

	<h1 class="text-xl font-bold">General settings</h1>
	<ImageUpload bind:imageUrl {setImageUrl} />
	<form method="POST" class="flex w-full flex-col gap-sm" use:enhance>
		<div class="flex items-center justify-center">
			<!-- TODO File upload -->
			<!-- <input type="file" name="image" id="image" on:change={onFileChange} accept="image/*" /> -->
		</div>
		<Label.Root for="email" class="mb-xs flex flex-col gap-xs font-bold">
			{$_('email', { default: 'Email' })}
			<div class="relative">
				<input
					type="text"
					name="email"
					aria-invalid={$errors.email ? 'true' : undefined}
					bind:value={$form.email}
					class:input-valid={$errors.email === undefined}
					class:input-invalid={$errors.email !== undefined}
					{...$constraints.email}
				/>

				{#if $errors.email !== undefined}
					<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-red-500">
						<XCircleIcon class="size-5" />
					</div>
				{/if}
			</div>
			{#if $errors.email}
				<p class="error-message">{$errors.email}</p>
			{/if}
		</Label.Root>

		<Label.Root for="username" class="mb-xs flex flex-col gap-xs font-bold">
			{$_('username', { default: 'Username' })}
			<div class="relative">
				<input
					type="text"
					name="username"
					aria-invalid={$errors.username ? 'true' : undefined}
					bind:value={$form.username}
					class:input-valid={$errors.username === undefined}
					class:input-invalid={$errors.username !== undefined}
					{...$constraints.username}
				/>

				{#if $errors.username !== undefined}
					<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-red-500">
						<XCircleIcon class="size-5" />
					</div>
				{/if}
			</div>
			{#if $errors.username}
				<p class="error-message">{$errors.username}</p>
			{/if}
		</Label.Root>
		<div class="flex gap-sm">
			<Button>{$_('cancel', { default: 'Cancel' })}</Button>
			<Button type="submit">{$_('save')}</Button>
		</div>
	</form>
</div>

<style lang="postcss">
	/* input {
		@apply border-dashed border-purple-600 bg-transparent font-mono text-xs text-white;
	} */
</style>
