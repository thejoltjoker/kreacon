<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import TextInput from '$lib/components/InputField.svelte';
	import Link from '$lib/components/Link.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { passwordSchema } from '$lib/schemas/passwordSchema';
	import { userRegistrationSchema } from '$lib/schemas/userRegistrationSchema';
	import OAuthButtons from '../../_components/OAuthButtons.svelte';
	import PasswordValidationInfo from './PasswordValidationInfo.svelte';

	export let form;

	let email = '';
	let password = '';
	let confirmPassword = '';
	let emailIsValid: boolean | undefined = undefined;
	let passwordIsValid: boolean | undefined = undefined;
	let loading: boolean = false;
	let validationErrorPaths: string[] = ['too_small', 'special', 'number', 'common'];

	// On form error
	$: {
		if (form?.data?.errors) {
			email = form?.data?.email ?? '';
			password = '';
			confirmPassword = '';
			if (form?.errors) {
				console.warn('Form errors', form?.errors);
			}
		}
		// if (form?.errors && !form?.data?.errors) {
		// 	password = '';
		// 	confirmPassword = '';
		// }
	}

	// TODO Empty password and confirm password on email error
	// $: {
	// 	if (form?.errors?.email) {
	// 		password = '';
	// 		confirmPassword = '';
	// 	}
	// }

	$: {
		if (email) {
			emailIsValid = userRegistrationSchema.innerType().shape.email.safeParse(email).success;
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
	<OAuthButtons />
	<Divider>or use your email</Divider>
	<TextInput
		label="Email"
		id="email"
		name="email"
		placeholder="Email"
		bind:value={email}
		isValid={emailIsValid}
		errorMessage={form?.errors?.email}
	/>
	<TextInput
		label="Password"
		id="password"
		type="password"
		name="password"
		placeholder={form?.password ? 'Invalid password' : 'Password'}
		isValid={passwordIsValid}
		errorMessage={form?.errors?.password}
		bind:value={password}
		onChange={handlePasswordValidation}
	/>
	<TextInput
		label="Confirm Password"
		id="confirmPassword"
		type="password"
		name="confirmPassword"
		placeholder="Confirm Password"
		isValid={passwordIsValid && confirmPassword === password}
		errorMessage={form?.errors?.confirmPassword}
		bind:value={confirmPassword}
	/>
	<div class="origin-top transition-all duration-500">
		<PasswordValidationInfo bind:validationErrorPaths />
	</div>
	<Button variant="rose" type="submit">
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
