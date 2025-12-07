<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { getContext } from 'svelte';

	const highlightActive = getContext<boolean>('highlightActive');

	interface Props {
		href: string;
		children: Snippet;
		class?: string;
	}
	let { href, children, class: className, ...props }: Props = $props();

	const isActive = $derived($page.url.pathname.split('?')[0] === href.split('?')[0]);
</script>

<li>
	<Button
		variant="ghost"
		{href}
		class={cn(
			className,
			highlightActive && isActive && 'bg-muted-background hover:bg-muted-foreground text-white'
		)}
		{...props}
	>
		{@render children()}
	</Button>
</li>
