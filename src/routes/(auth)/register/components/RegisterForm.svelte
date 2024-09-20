<script lang="ts">
	// TODO run validation with bound value instead of onChange
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import TextInput from '$lib/components/InputField.svelte';
	import { userSchema } from '$lib/validation/RegisterForm.validation';
	import { z } from 'zod';
	import GoogleButton from './GoogleButton.svelte';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let emailIsValid: boolean | undefined = undefined;

	const handleEmailChange = (value: string) => {
		//Validate password with zod
		if (z.string().email().safeParse(value).success) {
			emailIsValid = true;
		} else {
			emailIsValid = false;
		}
	};
</script>

<div class="wrapper">
	<div class="container">
		<GoogleButton />
		<Divider>or register with email</Divider>
		<form method="POST" action="?/login" use:enhance>
			<TextInput
				label="Email"
				id="email"
				placeholder="Email"
				bind:value={email}
				name="email"
				onChange={handleEmailChange}
				isValid={emailIsValid}
			/>
			<TextInput
				label="Password"
				id="password"
				type="password"
				name="password"
				placeholder="Password"
				bind:value={password}
			/>
			<TextInput
				label="Confirm Password"
				id="confirmPassword"
				type="password"
				name="confirmPassword"
				placeholder="Confirm Password"
				bind:value={confirmPassword}
			/>
			<Button variant="rose" type="submit">Register</Button>
			<p class="text-center">Already a member? <a href="/login">Log in</a></p>
		</form>
	</div>
</div>

<style lang="postcss">
	.wrapper {
		@apply flex h-screen flex-col items-center justify-center;
	}

	.container {
		@apply p-xxl flex w-[30rem] flex-col gap-md rounded-md border border-neutral-700;
		& form {
			@apply flex flex-col gap-md;
		}
	}
</style>
