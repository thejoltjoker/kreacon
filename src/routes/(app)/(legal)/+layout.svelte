<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="mx-auto max-w-screen-sm [&_ul]:list-inside [&_ul]:list-disc">
	{@render children()}
</div>
