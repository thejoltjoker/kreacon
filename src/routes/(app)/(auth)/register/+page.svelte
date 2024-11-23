<script lang="ts">
	import Button from '$lib/components/OldButton.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Link from '$lib/components/Link.svelte';
	import { registerUserSchema } from '$lib/schemas/user';
	import { _ } from 'svelte-i18n';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { debounce } from 'throttle-debounce';
	import OAuthButtons from '../_components/OAuthButtons.svelte';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';

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
		<ValidatedInput
			label="username"
			name="username"
			form="check"
			value={$form.username}
			errors={$errors.username}
			delayed={$delayed}
			constraints={$constraints.username}
			onInput={checkUsername}
		/>
		<input type="hidden" name="username" value={$form.username} />

		<ValidatedInput
			label="email"
			type="email"
			name="email"
			value={$form.email}
			errors={$errors.email}
			constraints={$constraints.email}
		/>

		<ValidatedInput
			label="password"
			type="password"
			name="password"
			value={$form.password}
			errors={$errors.password}
			constraints={$constraints.password}
		/>

		<Button variant="rose" type="submit">
			{$_('register', { default: 'Register' })}
		</Button>
		<p class="text-center">
			{$_('already_member', { default: 'Already a member?' })}
			<Link href="/login">{$_('login', { default: 'Log in' })}</Link>
		</p>
	</form>
	<form id="check" method="POST" action="?/check" use:submitEnhance></form>
</div>
