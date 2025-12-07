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
	@reference "../../app.css";

	.wrapper {
		@apply py-sm flex w-full grow flex-col items-center justify-center;
	}

	.container {
		@apply gap-md border-shade-600 bg-bg px-md py-xl md:p-2xl flex w-full max-w-120 flex-col rounded-md border;
	}
</style>
