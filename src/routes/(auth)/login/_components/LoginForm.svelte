<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import TextInput from '$lib/components/InputField.svelte';
	import Link from '$lib/components/Link.svelte';
	import type { PageData } from '../$types';
	import OAuthButtons from '../../_components/OAuthButtons.svelte';

	export let data: PageData;

	let email = '';
	let password = '';
</script>

<form method="POST" action="?/login" use:enhance>
	{#if data.providers.length > 0}
		<OAuthButtons providers={data.providers} />
		<Divider>or sign in with email</Divider>
	{/if}
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
	<Button variant="rose" type="submit">Login</Button>
	<!-- TODO Form validation -->
	<p class="text-center">Not a member? <Link href="/register">Register</Link></p>
</form>

<style lang="postcss">
	form {
		@apply flex flex-col gap-md;
	}
</style>
