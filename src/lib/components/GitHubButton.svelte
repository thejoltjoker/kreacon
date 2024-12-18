<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { t } from '$lib/i18n';
	import GitHubIcon from '$lib/symbols/GitHubIcon.svg?raw';
</script>

<Button type="button" variant="white" href="/oauth/login/github">
	<span class="icon">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html GitHubIcon}
	</span>
	{$t('Sign in with GitHub')}
</Button>

<style lang="postcss">
	.icon {
		@apply h-5 w-5;
	}
</style>
