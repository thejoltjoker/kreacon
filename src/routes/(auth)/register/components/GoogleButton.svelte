<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import GoogleIcon from '$lib/symbols/GoogleIcon.svg?raw';
</script>

<Button><span class="icon">{@html GoogleIcon}</span>Sign in with Google</Button>

<style lang="postcss">
	.icon {
		@apply h-4 w-4;
	}
</style>
