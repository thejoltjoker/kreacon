<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/InputField.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import GoogleButton from '$lib/components/GoogleButton.svelte';
	import { enhance } from '$app/forms';
	let email = '';
	let password = '';
</script>

<form method="POST" action="?/login" use:enhance>
	<GoogleButton />
	<Divider>or sign in with email</Divider>
	<TextInput
		label="Email"
		id="email"
		placeholder="Username or Email"
		bind:value={email}
		name="email"
	/>
	<TextInput
		label="Password"
		id="password"
		type="password"
		name="password"
		placeholder="Password"
		bind:value={password}
	/>
	<Button variant="rose" type="submit">Login</Button>
	<p class="text-center">Not a member? <a href="/register">Register</a></p>
</form>

<style lang="postcss">
	form {
		@apply flex flex-col gap-md;
	}
</style>
