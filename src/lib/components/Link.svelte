<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	interface Props extends HTMLAttributes<HTMLAnchorElement> {
		href: string;
		children: Snippet;
	}

	let { href, children, ...props }: Props = $props();

	const className = twMerge(
		'underline decoration-primary decoration-2 hover:text-primary hover:no-underline hover:opacity-100',
		props.class
	);
</script>

<a {href} class={className} {...props}>
	{@render children()}
</a>
