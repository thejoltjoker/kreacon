<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import { _ } from 'svelte-i18n';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import ImageUpload from './_components/ImageUpload.svelte';
	import { user } from '$lib/stores/userStore';

	export let data: PageData;

	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		invalidateAll: 'force'
	});

	let imageUrl = data.user?.image ?? 'https://placehold.co/100x100';

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
		console.log(input);
		if (input.files && input.files.length > 0) {
			handleFile(input.files[0]);
		}
	};
	$: console.error($errors);
	$: console.log(imageUrl);

	user.set(data.user);
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

{#if $message}<h3>{$message}</h3>{/if}

<div class="mx-auto max-w-screen-sm">
	<!-- <SuperDebug data={$form} /> -->
	<div class="flex h-screen flex-col items-center">
		<h1 class="text-4xl font-bold">Profile</h1>
		<ImageUpload bind:imageUrl {setImageUrl} />
		<form method="POST" class="flex w-full flex-col gap-sm" use:enhance>
			<div class="flex items-center justify-center">
				<!-- TODO File upload -->
				<!-- <input type="file" name="image" id="image" on:change={onFileChange} accept="image/*" /> -->
			</div>
			<label for="id">ID</label>
			<input type="text" name="id" id="id" bind:value={$form.id} />
			<InputField
				id="email"
				name="email"
				label={$_('page.user_email')}
				bind:value={$form.email}
				errorMessage={$errors.email}
				{...$constraints.email}
			/>

			<InputField
				id="username"
				name="username"
				label={$_('page.user_username')}
				bind:value={$form.username}
				errorMessage={$errors.username}
				{...$constraints.username}
			/>
			<div class="flex gap-sm">
				<Button>{$_('page.user_cancel', { default: 'Cancel' })}</Button>
				<Button type="submit" variant="rose">{$_('page.user_save', { default: 'Save' })}</Button>
			</div>
		</form>
	</div>
</div>

<style lang="postcss">
	input {
		@apply border-dashed border-purple-600 bg-transparent font-mono text-xs text-white;
	}
</style>
