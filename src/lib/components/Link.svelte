<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	interface LinkProps extends HTMLAnchorAttributes {
		children: Snippet;
	}

	let { href, children, ...props }: LinkProps = $props();

	const className = cn(
		'underline decoration-primary decoration-2 hover:text-primary hover:no-underline hover:opacity-100',
		props.class
	);
</script>

<a {href} class={className} {...props}>
	{@render children()}
</a>
