<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade, fly } from 'svelte/transition';

	interface AnimateOnScrollProps extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
		threshold?: number;
		animation?: 'fly' | 'fade';
	}

	let {
		children,
		id,
		threshold = 0.25,
		animation = 'fade',
		...props
	}: AnimateOnScrollProps = $props();
	const animationFunction = animation === 'fly' ? fly : fade;
	let isVisible = $state(false);

	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						observer.disconnect();
					}
				});
			},
			{ threshold }
		);

		const element = document.querySelector(`#${id}`);
		if (element) observer.observe(element);

		return () => observer.disconnect();
	});
</script>

{#if isVisible}
	<div {id} {...props} transition:animationFunction={{ y: 100 }}>{@render children()}</div>
{:else}
	<div {id} {...props} class={cn('opacity-0', props.class)}>{@render children()}</div>
{/if}
