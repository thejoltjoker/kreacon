<script lang="ts">
	import TextInput from '$lib/components/InputField.svelte';
	import Link from '$lib/components/Link.svelte';
	import { Label } from 'bits-ui';
	import { CheckCircle2Icon, XCircleIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import OAuthButtons from '../_components/OAuthButtons.svelte';
	import Divider from '$lib/components/Divider.svelte';

	const { data }: { data: PageData } = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.form);
	$effect(() => {
		console.log($message);
	});
</script>

<SuperDebug data={$form} />
<div class="flex w-full flex-col gap-md">
	{#if data.providers.length > 0}
		<OAuthButtons providers={data.providers} />
		<Divider>{$_('login_divider', { default: 'or sign in with email' })}</Divider>
	{/if}
	<form method="POST" action="?/login" use:enhance class="flex w-full flex-col gap-md">
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

		<Button type="submit">
			{$_('login', { default: 'Login' })}
		</Button>

		{#if $message}
			<h3 class="text-center text-red-500">{$message.text}</h3>
		{/if}

		<p class="text-center">
			{$_('not_member', { default: 'Not a member?' })}
			<Link href="/register">{$_('register', { default: 'Register' })}</Link>
		</p>
	</form>
</div>
