<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setContext } from 'svelte';

	interface Props extends HTMLAttributes<HTMLUListElement> {
		children: Snippet;
		highlightActive?: boolean;
	}

	let { children, highlightActive = true, ...props }: Props = $props();
	setContext('highlightActive', highlightActive);
	let className = cn('flex items-center gap-sm', props.class);
</script>

<ul class={className} {...props}>
	{@render children()}
</ul>
