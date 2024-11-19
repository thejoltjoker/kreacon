<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Link from '$lib/components/Link.svelte';
	import { Label } from 'bits-ui';
	import { XCircleIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { superForm } from 'sveltekit-superforms';
	import OAuthButtons from '../_components/OAuthButtons.svelte';

	interface PageProps {
		data: import('./$types').PageData;
	}

	let { data }: PageProps = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.form);

	// $: {
	// 	if (email) {
	// 		emailIsValid = userRegistrationSchema.shape.email.safeParse(email).success;
	// 	}
	// }

	// const handlePasswordValidation = () => {
	// 	passwordSchema.spa(password).then((result) => {
	// 		if (result.error) {
	// 			validationErrorPaths = result.error.errors.map((error) => {
	// 				if (error.code === 'custom') {
	// 					return error?.params?.code ? error.params.code : 'unknown';
	// 				}
	// 				return error.code;
	// 			});
	// 			passwordIsValid = false;
	// 		} else {
	// 			validationErrorPaths = [];
	// 			passwordIsValid = true;
	// 		}
	// 	});
	// };
</script>

<div class="flex w-full flex-col gap-md">
	{#if data.providers.length > 0}
		<OAuthButtons providers={data.providers} />
		<Divider>or use your email</Divider>
	{/if}

	<form method="POST" action="?/register" use:enhance class="flex flex-col gap-md">
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
		<Label.Root for="email" class="mb-xs flex flex-col gap-xs font-bold">
			{$_('email', { default: 'Email' })}
			<div class="relative">
				<input
					type="email"
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
		<Label.Root for="password" class="mb-xs flex flex-col gap-xs font-bold">
			{$_('password', { default: 'Password' })}
			<div class="relative">
				<input
					type="password"
					name="password"
					aria-invalid={$errors.password ? 'true' : undefined}
					bind:value={$form.password}
					class:input-valid={$errors.password === undefined}
					class:input-invalid={$errors.password !== undefined}
					{...$constraints.password}
				/>

				{#if $errors.password !== undefined}
					<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-red-500">
						<XCircleIcon class="size-5" />
					</div>
				{/if}
			</div>
			{#if $errors.password}
				<p class="error-message">{$errors.password}</p>
			{/if}
		</Label.Root>

		<!-- <div class="origin-top transition-all duration-500">
		<PasswordValidationInfo bind:validationErrorPaths />
	</div> -->
		<Button variant="rose" type="submit">
			<!-- {#if loading}
			<Spinner />
		{/if} -->
			{$_('register', { default: 'Register' })}
		</Button>
		<p class="text-center">
			{$_('already_member', { default: 'Already a member?' })}
			<Link href="/login">{$_('login', { default: 'Log in' })}</Link>
		</p>
	</form>
</div>
