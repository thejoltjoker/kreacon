<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DiscordIcon from '$lib/symbols/DiscordIcon.svg?raw';
	import { _ } from 'svelte-i18n';
</script>

<Button type="button" variant="white" href="/oauth/login/discord">
	<span class="icon">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html DiscordIcon}
	</span>
	{$_('sign_in_discord', { default: 'Sign in with Discord' })}
</Button>

<style lang="postcss">
	.icon {
		@apply h-5 w-5;
	}
</style>
