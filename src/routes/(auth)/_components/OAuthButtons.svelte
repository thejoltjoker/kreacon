<script>
	import DiscordButton from '$lib/components/DiscordButton.svelte';
	import GitHubButton from '$lib/components/GitHubButton.svelte';
</script>

<!-- <GoogleButton /> -->
<section class="oauth-buttons">
	<DiscordButton />
	<GitHubButton />
</section>

<style lang="postcss">
	.oauth-buttons {
		@apply flex flex-col gap-sm;
	}
</style>
