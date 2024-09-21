<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import DiscordButton from '$lib/components/DiscordButton.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import GoogleButton from '$lib/components/GoogleButton.svelte';
	import TextInput from '$lib/components/InputField.svelte';
	import {
		hasNumber,
		hasSpecialCharacter,
		isCommonPassword,
		isLongEnough,
		type PasswordValidation
	} from '$lib/validation/password/passwordValidation';
	import { z } from 'zod';
	import PasswordValidationInfo from './PasswordValidationInfo.svelte';
	import Link from '$lib/components/Link.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	export let form;

	let email = '';
	let password = '';
	let confirmPassword = '';
	let emailIsValid: boolean | undefined = undefined;
	let passwordIsValid: boolean | undefined = undefined;
	let confirmPasswordIsValid: boolean | undefined = undefined;
	let passwordValidationState: PasswordValidation = {
		isLongEnough: false,
		hasSpecialCharacter: false,
		hasNumber: false,
		isNotCommonPassword: false,
		isNotUsernameOrEmail: false
	};
	let loading: boolean = false;
	$: {
		if (email) {
			emailIsValid = z.string().email().safeParse(email).success;
		}
	}

	$: {
		passwordValidationState.isLongEnough = isLongEnough(password);
		passwordValidationState.hasSpecialCharacter = hasSpecialCharacter(password);
		passwordValidationState.hasNumber = hasNumber(password);
		isCommonPassword(password, '10000').then((result) => {
			passwordValidationState.isNotCommonPassword = !result;
		});
		passwordValidationState.isNotUsernameOrEmail = email !== password;
	}

	$: {
		if (password) {
			if (
				passwordValidationState.isLongEnough &&
				passwordValidationState.hasSpecialCharacter &&
				passwordValidationState.hasNumber &&
				passwordValidationState.isNotCommonPassword &&
				passwordValidationState.isNotUsernameOrEmail
			) {
				passwordIsValid = true;
			} else {
				passwordIsValid = false;
			}
		}
	}

	$: {
		if (confirmPassword) {
			confirmPasswordIsValid = password === confirmPassword;
		}
	}

	$: {
		if (form?.password) {
			password = '';
			confirmPassword = '';
			passwordIsValid = false;
			confirmPasswordIsValid = false;
		}
	}
</script>

{#if form?.success}
	<p class="success">Registration successful</p>
{/if}
<form
	method="POST"
	action="?/store"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	}}
>
	{#if form?.password}<p class="error">{form?.password}</p>{/if}

	<GoogleButton />
	<DiscordButton />
	<Divider>or use your email</Divider>
	<TextInput
		label="Email"
		id="email"
		name="email"
		placeholder="Email"
		bind:value={email}
		isValid={emailIsValid}
	/>
	<TextInput
		label="Password"
		id="password"
		type="password"
		name="password"
		placeholder={form?.password ? 'Invalid password' : 'Password'}
		bind:value={password}
		isValid={passwordIsValid}
	/>
	<TextInput
		label="Confirm Password"
		id="confirmPassword"
		type="password"
		name="confirmPassword"
		placeholder="Confirm Password"
		bind:value={confirmPassword}
		isValid={confirmPasswordIsValid}
	/>
	<div class="origin-top transition-all duration-500">
		<PasswordValidationInfo bind:passwordValidationState />
	</div>
	<Button
		variant="rose"
		type="submit"
		disabled={!(emailIsValid && passwordIsValid && confirmPasswordIsValid) || loading}
		on:click={() => (loading = true)}
	>
		{#if loading}
			<Spinner />
		{/if}
		Register
	</Button>
	<p class="text-center">Already a member? <Link href="/login">Log in</Link></p>
</form>

<style lang="postcss">
	form {
		@apply flex flex-col gap-md;
	}
</style>
