<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	interface Props extends HTMLAttributes<HTMLAnchorElement> {
		href: string;
		children: Snippet;
	}

	let { href, onclick, children, ...props }: Props = $props();

	const className = twMerge(
		'underline decoration-rose-500 decoration-2 hover:text-rose-500 hover:no-underline hover:opacity-100',
		props.class
	);
</script>

<a {href} class={className} {...props}>
	{@render children()}
</a>
