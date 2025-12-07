<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="p-sm md:p-xl flex w-full max-w-(--breakpoint-md)">
	{@render children()}
</div>
