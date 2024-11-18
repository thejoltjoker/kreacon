<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import TextInput from '$lib/components/InputField.svelte';
	import Link from '$lib/components/Link.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { passwordSchema } from '$lib/schemas/passwordSchema';
	import { userRegistrationSchema } from '$lib/schemas/userRegistrationSchema';
	import { _ } from 'svelte-i18n';
	import OAuthButtons from '../_components/OAuthButtons.svelte';
	import PasswordValidationInfo from './_components/PasswordValidationInfo.svelte';
	// TODO Empty password on email error
	// $: {
	// 	if (form?.errors?.email) {
	// 		password = '';
	// 	}
	// }

	import { superForm } from 'sveltekit-superforms';

	// Client API:
	const { form } = superForm(data.form);

	$: {
		if (email) {
			emailIsValid = userRegistrationSchema.shape.email.safeParse(email).success;
		}
	}

	const handlePasswordValidation = () => {
		passwordSchema.spa(password).then((result) => {
			if (result.error) {
				validationErrorPaths = result.error.errors.map((error) => {
					if (error.code === 'custom') {
						return error?.params?.code ? error.params.code : 'unknown';
					}
					return error.code;
				});
				passwordIsValid = false;
			} else {
				validationErrorPaths = [];
				passwordIsValid = true;
			}
		});
	};
</script>

<form
	method="POST"
	action="?/register"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	}}
>
	{#if data.providers.length > 0}
		<OAuthButtons providers={data.providers} />
		<Divider>or use your email</Divider>
	{/if}
	<TextInput
		label={$_('email', { default: 'Email' })}
		id="email"
		name="email"
		placeholder={$_('email', { default: 'Email' })}
		bind:value={$form.email}
		isValid={emailIsValid}
		errorMessage={form?.errors?.email}
	/>
	<TextInput
		label={$_('password', { default: 'Password' })}
		id="password"
		type="password"
		name="password"
		placeholder={$_('password', { default: 'Password' })}
		isValid={passwordIsValid}
		errorMessage={form?.errors?.password}
		bind:value={$form.password}
		onChange={handlePasswordValidation}
	/>

	<div class="origin-top transition-all duration-500">
		<PasswordValidationInfo bind:validationErrorPaths />
	</div>
	<Button variant="rose" type="submit">
		{#if loading}
			<Spinner />
		{/if}
		{$_('register', { default: 'Register' })}
	</Button>
	<p class="text-center">
		{$_('already_member', { default: 'Already a member?' })}
		<Link href="/login">{$_('login', { default: 'Log in' })}</Link>
	</p>
</form>

<style lang="postcss">
	form {
		@apply flex flex-col gap-md;
	}
</style>
