<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import GoogleIcon from '$lib/symbols/GoogleIcon.svg?raw';
	import { _ } from 'svelte-i18n';
</script>

<Button>
	<span class="icon">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html GoogleIcon}
	</span>{$_('button.login.google', { default: 'Sign in with Google' })}
</Button>

<style lang="postcss">
	.icon {
		@apply h-4 w-4;
	}
</style>
