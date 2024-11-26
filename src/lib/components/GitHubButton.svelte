<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import GitHubIcon from '$lib/symbols/GitHubIcon.svg?raw';
	import { _ } from 'svelte-i18n';
</script>

<Button type="button" variant="white" href="/oauth/login/github">
	<span class="icon">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html GitHubIcon}
	</span>
	{$_('sign_in_github', { default: 'Sign in with GitHub' })}
</Button>

<style lang="postcss">
	.icon {
		@apply h-5 w-5;
	}
</style>
