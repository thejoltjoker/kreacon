<script lang="ts">
	import PageTransition from '$lib/components/PageTransition.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
