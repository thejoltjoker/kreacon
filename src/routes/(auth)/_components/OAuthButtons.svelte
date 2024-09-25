<script lang="ts">
	import DiscordButton from '$lib/components/DiscordButton.svelte';
	import GitHubButton from '$lib/components/GitHubButton.svelte';
	import type { OAuthProvider } from '$lib/server/auth/oauth/OAuthClient';

	export let providers: OAuthProvider[] = [];
</script>

<!-- <GoogleButton /> -->
<section class="oauth-buttons">
	{#if providers.includes('discord')}
		<DiscordButton />
	{/if}
	{#if providers.includes('github')}
		<GitHubButton />
	{/if}
</section>

<style lang="postcss">
	.oauth-buttons {
		@apply flex flex-col gap-sm;
	}
</style>
