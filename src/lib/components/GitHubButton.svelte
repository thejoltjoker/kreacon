<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import GitHubIcon from '$lib/symbols/GitHubIcon.svg?raw';
</script>

<a href="/oauth/login/github">
	<Button>
		<span class="icon">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html GitHubIcon}
		</span>Sign in with GitHub
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
