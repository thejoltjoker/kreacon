<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/InputField.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import GoogleButton from '$lib/components/GoogleButton.svelte';
	import { enhance } from '$app/forms';
	import { z } from 'zod';
	import Link from '$lib/components/Link.svelte';

	let email = '';
	let password = '';
	let emailIsValid: boolean = false;
	let passwordIsValid: boolean = false;

	$: {
		if (email) {
			emailIsValid = z.string().email().safeParse(email).success;
		}
	}

	$: {
		passwordIsValid = password ? true : false;
	}
</script>

<form method="POST" action="?/login" use:enhance>
	<GoogleButton />
	<Divider>or sign in with email</Divider>
	<TextInput
		label="Email"
		id="email"
		placeholder="Email"
		bind:value={email}
		name="email"
		required
	/>
	<TextInput
		label="Password"
		id="password"
		type="password"
		name="password"
		placeholder="Password"
		bind:value={password}
		required
	/>
	<Button variant="rose" type="submit" disabled={!emailIsValid || !passwordIsValid}>Login</Button>
	<p class="text-center">Not a member? <Link href="/register">Register</Link></p>
</form>

<style lang="postcss">
	form {
		@apply flex flex-col gap-md;
	}
</style>
