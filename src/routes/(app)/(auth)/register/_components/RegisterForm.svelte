<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import TextInput from '$lib/components/InputField.svelte';
	import Link from '$lib/components/Link.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { passwordSchema } from '$lib/schemas/passwordSchema';
	import { userRegistrationSchema } from '$lib/schemas/userRegistrationSchema';
	import type { PageData } from '../$types';
	import OAuthButtons from '../../_components/OAuthButtons.svelte';
	import PasswordValidationInfo from './PasswordValidationInfo.svelte';
	import { _ } from 'svelte-i18n';
	export let form;
	export let data: PageData;

	let email = '';
	let password = '';

	let emailIsValid: boolean | undefined = undefined;
	let passwordIsValid: boolean | undefined = undefined;
	let loading: boolean = false;
	let validationErrorPaths: string[] = ['too_small', 'special', 'number', 'common'];

	// On form error
	$: {
		if (form?.data?.errors) {
			email = form?.data?.email ?? '';
			password = '';
			if (form?.errors) {
				console.warn('Form errors', form?.errors);
			}
		}
	}

	// TODO Empty password on email error
	// $: {
	// 	if (form?.errors?.email) {
	// 		password = '';
	// 	}
	// }

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
	action="?/store"
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
		label={$_('auth.email', { default: 'Email' })}
		id="email"
		name="email"
		placeholder={$_('auth.email', { default: 'Email' })}
		bind:value={email}
		isValid={emailIsValid}
		errorMessage={form?.errors?.email}
	/>
	<TextInput
		label={$_('auth.password', { default: 'Password' })}
		id="password"
		type="password"
		name="password"
		placeholder={form?.password
			? $_('auth.invalid_password')
			: $_('auth.password', { default: 'Password' })}
		isValid={passwordIsValid}
		errorMessage={form?.errors?.password}
		bind:value={password}
		onChange={handlePasswordValidation}
	/>

	<div class="origin-top transition-all duration-500">
		<PasswordValidationInfo bind:validationErrorPaths />
	</div>
	<Button variant="rose" type="submit">
		{#if loading}
			<Spinner />
		{/if}
		{$_('button.register', { default: 'Register' })}
	</Button>
	<p class="text-center">
		{$_('auth.not_member', { default: 'Already a member?' })}
		<Link href="/login">{$_('auth.login', { default: 'Log in' })}</Link>
	</p>
</form>

<style lang="postcss">
	form {
		@apply flex flex-col gap-md;
	}
</style>
