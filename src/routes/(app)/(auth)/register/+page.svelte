<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Link from '$lib/components/Link.svelte';
	import { registerUserSchema } from '$lib/schemas/user';
	import { Label } from 'bits-ui';
	import { CheckCircle2Icon, LoaderCircleIcon, XCircleIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { debounce } from 'throttle-debounce';
	import OAuthButtons from '../_components/OAuthButtons.svelte';
	import PasswordValidationInfo from './_components/PasswordValidationInfo.svelte';

	interface PageProps {
		data: import('./$types').PageData;
	}

	let { data }: PageProps = $props();

	const { form, errors, message, enhance, constraints, allErrors } = superForm(data.form, {
		validators: zodClient(registerUserSchema)
	});

	const {
		delayed,
		submit: submitCheckUsername,
		enhance: submitEnhance
	} = superForm(
		{ username: '' },
		{
			invalidateAll: false,
			applyAction: false,
			multipleSubmits: 'abort',
			onSubmit({ cancel }) {
				if (!$form.username) cancel();
			},
			onUpdated({ form }) {
				// Update the other form to show the error message
				$errors.username = form.errors.username;
			}
		}
	);

	const checkUsername = debounce(500, submitCheckUsername);
	$effect(() => {
		console.log($errors);
	});
</script>

<SuperDebug data={$form} />

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
					form="check"
					name="username"
					aria-invalid={$errors.username ? 'true' : undefined}
					bind:value={$form.username}
					ondblclick={(e) => (e.target as HTMLInputElement).select()}
					class:input-valid={!$delayed && $errors.username === undefined && $form.username !== ''}
					class:input-invalid={$errors.username !== undefined}
					oninput={checkUsername}
					{...$constraints.username}
				/>
				<input type="hidden" name="username" value={$form.username} />

				{#if $delayed}
					<div
						class="absolute right-xs top-1/2 size-5 -translate-y-1/2 animate-pulse text-zinc-500"
					>
						<LoaderCircleIcon class="stroke-3 size-5 animate-spin stroke-zinc-500" />
					</div>
				{:else if $errors.username !== undefined}
					<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-red-500">
						<XCircleIcon class="size-5" />
					</div>
				{:else if $form.username}
					<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-green-500">
						<CheckCircle2Icon class="size-5" />
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
					ondblclick={(e) => (e.target as HTMLInputElement).select()}
					aria-invalid={$errors.email ? 'true' : undefined}
					bind:value={$form.email}
					class:input-valid={!$delayed && $errors.email === undefined && $form.email !== ''}
					class:input-invalid={$errors.email !== undefined}
					{...$constraints.email}
				/>

				{#if $errors.email !== undefined}
					<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-red-500">
						<XCircleIcon class="size-5" />
					</div>
				{:else if $form.email}
					<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-green-500">
						<CheckCircle2Icon class="size-5" />
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
					ondblclick={(e) => (e.target as HTMLInputElement).select()}
					aria-invalid={$errors.password ? 'true' : undefined}
					bind:value={$form.password}
					class:input-valid={$errors.password === undefined && $form.password !== ''}
					class:input-invalid={$errors.password !== undefined}
					{...$constraints.password}
				/>

				{#if $errors.password !== undefined}
					<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-red-500">
						<XCircleIcon class="size-5" />
					</div>
				{:else if $form.password}
					<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-green-500">
						<CheckCircle2Icon class="size-5" />
					</div>
				{/if}
			</div>
			{#if $errors.password}
				<ul class="flex flex-col gap-xs">
					{#each $errors.password as error}
						<li class="flex items-center gap-xs">
							<XCircleIcon class="size-5  text-red-500" />
							<p>
								{error}
							</p>
						</li>
					{/each}
				</ul>
			{/if}
		</Label.Root>

		<!-- <div class="origin-top transition-all duration-500">
			<PasswordValidationInfo errors={$errors.password} />
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
	<form id="check" method="POST" action="?/check" use:submitEnhance></form>
</div>
