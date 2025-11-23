<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import GoogleIcon from '$lib/symbols/GoogleIcon.svg?raw';
	import { t } from '$lib/i18n';
</script>

<Button>
	<span class="icon">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html GoogleIcon}
	</span>{$t('Sign in with Google')}
</Button>

<style lang="postcss">
	@reference "../../app.css";

	.icon {
		@apply h-4 w-4;
	}
</style>
