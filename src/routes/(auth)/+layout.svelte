<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div class="wrapper">
	<div class="container">
		{@render children()}
	</div>
</div>

<style lang="postcss">
	.wrapper {
		@apply flex w-full grow flex-col items-center justify-center py-sm;
	}

	.container {
		@apply flex w-full max-w-120 flex-col gap-md rounded-md border border-shade-600 bg-bg px-md py-xl md:p-2xl;
	}
</style>
