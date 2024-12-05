<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Link from '$lib/components/Link.svelte';
	import ValidatedInput from '$lib/components/ValidatedInput.svelte';
	import { registerUserSchema } from '$lib/schemas/user';
	import { toSnakeCase } from 'drizzle-orm/casing';
	import { _ } from 'svelte-i18n';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import OAuthButtons from '../_components/OAuthButtons.svelte';
	import { t } from '$lib/i18n';

	interface PageProps {
		data: import('./$types').PageData;
	}

	let { data }: PageProps = $props();

	// TODO Add message
	const { form, errors, enhance, constraints, message } = superForm(data.form, {
		validators: zodClient(registerUserSchema)
	});

	// TODO Username check
	// const {
	// 	delayed,
	// 	submit: submitCheckUsername,
	// 	enhance: submitEnhance
	// } = superForm(
	// 	{ username: '' },
	// 	{
	// 		invalidateAll: false,
	// 		applyAction: false,
	// 		multipleSubmits: 'abort',
	// 		onSubmit({ cancel }) {
	// 			if (!$form.username) cancel();
	// 		},
	// 		onUpdated({ form }) {
	// 			$errors.username = form.errors.username;
	// 		}
	// 	}
	// );

	// const checkUsername = debounce(500, submitCheckUsername);
</script>

<!-- <SuperDebug data={$form} /> -->

<div class="flex w-full flex-col gap-lg">
	<h1 class="text-center">Sign up</h1>
	{#if data.providers.length > 0}
		<OAuthButtons providers={data.providers} />
		<Divider>or use your email</Divider>
	{/if}

	<form method="POST" action="?/register" use:enhance class="flex flex-col gap-sm">
		<ValidatedInput
			type="text"
			label="username"
			name="username"
			bind:value={$form.username}
			errors={$errors.username}
			constraints={$constraints.username}
		/>
		<!-- <input type="hidden" name="username" value={$form.username} /> -->

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

		{#if $message}
			<p
				class="status"
				class:error={$message.status === 'error'}
				class:success={$message.status === 'success'}
			>
				{$t($message.text)}
			</p>
		{/if}
		<Button type="submit">{$t('Register')}</Button>
	</form>
	<!-- <form id="check" method="POST" action="?/check" use:submitEnhance></form> -->
	<p class="text-center">
		{$t('Already a member?')}
		<Link href="/login">{$t('Log in')}</Link>
	</p>
</div>
