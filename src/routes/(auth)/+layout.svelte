<script lang="ts">
	import PageTransition from '$lib/components/PageTransition.svelte';
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
		@apply flex h-[calc(100vh-6rem)] w-full flex-col items-center justify-center;
	}

	.container {
		@apply flex w-full max-w-[30rem] flex-col gap-md rounded-md border border-shade-600 bg-bg px-md py-xl md:p-2xl;
	}
</style>
