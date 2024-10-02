<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import TextInput from '$lib/components/InputField.svelte';
	import Link from '$lib/components/Link.svelte';
	import type { PageData } from '../$types';
	import OAuthButtons from '../../_components/OAuthButtons.svelte';
	import { _ } from 'svelte-i18n';
	export let data: PageData;

	let email = '';
	let password = '';
</script>

<form method="POST" action="?/login" use:enhance>
	{#if data.providers.length > 0}
		<OAuthButtons providers={data.providers} />
		<Divider>{$_('auth.login_divider', { default: 'or sign in with email' })}</Divider>
	{/if}
	<TextInput
		label={$_('auth.email', { default: 'Email' })}
		id="email"
		placeholder={$_('auth.email', { default: 'Email' })}
		bind:value={email}
		name="email"
		required
	/>
	<TextInput
		label={$_('auth.password', { default: 'Password' })}
		id="password"
		type="password"
		name="password"
		placeholder={$_('auth.password', { default: 'Password' })}
		bind:value={password}
		required
	/>
	<Button variant="rose" type="submit">{$_('button.login.login', { default: 'Login' })}</Button>
	<!-- TODO Form validation -->
	<p class="text-center">
		{$_('auth.not_member', { default: 'Not a member?' })}
		<Link href="/register">{$_('auth.register', { default: 'Register' })}</Link>
	</p>
</form>

<style lang="postcss">
	form {
		@apply flex flex-col gap-md;
	}
</style>
