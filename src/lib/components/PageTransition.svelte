<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	let {
		children,
		key,
		duration = 100
	}: { children: Snippet; key: string; duration?: number } = $props();
</script>

{#key key}
	<div in:fade={{ duration: duration, delay: duration }} out:fade={{ duration: duration }}>
		{@render children()}
	</div>
{/key}
