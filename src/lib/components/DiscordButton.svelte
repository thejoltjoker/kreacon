<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DiscordIcon from '$lib/symbols/DiscordIcon.svg?raw';
	import { _ } from 'svelte-i18n';
</script>

<a href="/oauth/login/discord">
	<Button>
		<span class="icon">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html DiscordIcon}
		</span>
		{$_('button.login_discord', { default: 'Sign in with Discord' })}
	</Button>
</a>

<style lang="postcss">
	.icon {
		@apply mt-1 h-5 w-5;
	}
	a {
		@apply flex;
	}
</style>
