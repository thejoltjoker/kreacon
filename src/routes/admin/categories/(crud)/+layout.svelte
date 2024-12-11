<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex w-full max-w-screen-md p-sm md:p-xl">
	{@render children()}
</div>
