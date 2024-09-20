<script lang="ts">
	// TODO run validation with bound value instead of onChange
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import GoogleButton from '$lib/components/GoogleButton.svelte';
	import TextInput from '$lib/components/InputField.svelte';
	import { z } from 'zod';
	import PasswordValidationInfo from './PasswordValidationInfo.svelte';
	import { isCommonPassword } from '$lib/validation/password/commonPassword';
	import DiscordButton from '$lib/components/DiscordButton.svelte';

	export let form;

	let email = 'john.doe@example.com';
	let password = 'Password123!';
	let confirmPassword = 'Password123!';
	let emailIsValid: boolean | undefined = undefined;
	let passwordIsValid: boolean | undefined = undefined;
	let confirmPasswordIsValid: boolean | undefined = undefined;
	let passwordValidationState = {
		isLongEnough: false,
		hasSpecialChar: false,
		hasNumber: false,
		isUncommonPassword: false
	};

	let minPasswordLength = 12;

	$: {
		if (email) {
			emailIsValid = z.string().email().safeParse(email).success;
		}
	}

	$: {
		passwordValidationState.isLongEnough = password.length >= minPasswordLength;
		passwordValidationState.hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
		passwordValidationState.hasNumber = /\d/.test(password);
		isCommonPassword(password, '10000').then((result) => {
			passwordValidationState.isUncommonPassword = !result;
		});
	}

	$: {
		if (password) {
			if (
				passwordValidationState.isLongEnough &&
				passwordValidationState.hasSpecialChar &&
				passwordValidationState.hasNumber &&
				passwordValidationState.isUncommonPassword
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
	<!-- this message is ephemeral; it exists because the page was rendered in
		   response to a form submission. it will vanish if the user reloads -->
	<p>Successfully logged in! Welcome back</p>
{/if}
<form method="POST" action="?/store" use:enhance>
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
		disabled={!(emailIsValid && passwordIsValid && confirmPasswordIsValid)}
	>
		Register
	</Button>
	<p class="text-center">Already a member? <a href="/login">Log in</a></p>
</form>

<style lang="postcss">
	form {
		@apply flex flex-col gap-md;
	}
</style>
