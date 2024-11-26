<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Link from '$lib/components/Link.svelte';
	import { registerUserSchema } from '$lib/schemas/user';
	import { _ } from 'svelte-i18n';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { debounce } from 'throttle-debounce';
	import OAuthButtons from '../_components/OAuthButtons.svelte';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';
	import { CheckCircle2Icon, LoaderCircleIcon, XCircleIcon } from 'lucide-svelte';
	import { Label } from 'bits-ui';

	interface PageProps {
		data: import('./$types').PageData;
	}

	let { data }: PageProps = $props();

	// TODO Add message
	const { form, errors, enhance, constraints } = superForm(data.form, {
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
				$errors.username = form.errors.username;
			}
		}
	);

	const checkUsername = debounce(500, submitCheckUsername);
</script>

<SuperDebug data={$form} />

<div class="flex w-full flex-col gap-md">
	{#if data.providers.length > 0}
		<OAuthButtons providers={data.providers} />
		<Divider>or use your email</Divider>
	{/if}

	<form method="POST" action="?/register" use:enhance class="flex flex-col gap-md">
		<Label.Root for="username" class="flex flex-col gap-xs font-bold">
			{$_('username', { default: 'Username' })}
			<div class="relative">
				<input
					type="text"
					name="username"
					form="check"
					aria-invalid={$errors.username ? 'true' : undefined}
					bind:value={$form.username}
					ondblclick={(e) => (e.target as HTMLInputElement).select()}
					class:input-valid={!$delayed && $errors.username === undefined && $form.username !== ''}
					class:input-invalid={$errors.username !== undefined}
					oninput={checkUsername}
					{...$constraints}
				/>

				{#if $delayed}
					<div
						class="absolute right-xs top-1/2 size-5 -translate-y-1/2 animate-pulse text-zinc-500"
					>
						<LoaderCircleIcon class="size-5 animate-spin stroke-zinc-500 stroke-3" />
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
				{#if Array.isArray($errors.username)}
					<ul class="flex flex-col gap-xs">
						{#each $errors.username as error}
							<li class="flex items-center gap-xs">
								<XCircleIcon class="size-5 text-red-500" />
								<p>{error}</p>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="error-message">{$errors.username}</p>
				{/if}
			{/if}
		</Label.Root>

		<input type="hidden" name="username" value={$form.username} />

		<ValidatedInput
			label="email"
			type="email"
			name="email"
			bind:value={$form.email}
			errors={$errors.email}
			constraints={$constraints.email}
		/>

		<ValidatedInput
			label="password"
			type="password"
			name="password"
			bind:value={$form.password}
			errors={$errors.password}
			constraints={$constraints.password}
		/>

		<Button type="submit">{$_('register', { default: 'Register' })}</Button>
		<p class="text-center">
			{$_('already_member', { default: 'Already a member?' })}
			<Link href="/login">{$_('login', { default: 'Log in' })}</Link>
		</p>
	</form>
	<form id="check" method="POST" action="?/check" use:submitEnhance></form>
</div>
