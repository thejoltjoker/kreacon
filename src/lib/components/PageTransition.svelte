<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	let {
		children,
		key,
		class: className,
		duration = 100
	}: { children: Snippet; key: string; class?: string; duration?: number } = $props();
</script>

{#key key}
	<div
		class={className}
		in:fade={{ duration: duration, delay: duration }}
		out:fade={{ duration: duration }}
	>
		{@render children()}
	</div>
{/key}
