<script lang="ts">
	import { Button } from 'bits-ui';
	import { twMerge } from 'tailwind-merge';
	import type { Snippet } from 'svelte';
	type Props = Button.RootProps & {
		variant?: 'rose' | 'transparent';
		class?: string | undefined;
		children: Snippet;
		size?: 'sm' | 'md' | 'lg';
	};

	let { variant, size, class: className, children, ...restProps }: Props = $props();

	const variants = {
		rose: 'bg-rose-500 text-white border-rose-600 hover:enabled:bg-rose-900/20 transition hover:enabled:border hover:enabled:border-rose-500',
		transparent:
			'bg-transparent dark:text-white dark:border-white dark:hover:enabled:bg-white dark:hover:bg-white dark:hover:enabled:text-black dark:hover:text-black'
	};

	const sizeClasses = {
		sm: 'h-input-sm text-sm px-md',
		md: 'h-input-md text-base px-5',
		lg: 'h-input-lg text-lg px-5'
	};

	let classes = $derived(
		twMerge(
			'relative inline-flex flex-grow items-center justify-center gap-xs rounded-full border font-bold transition-colors disabled:cursor-default disabled:opacity-50',
			variants[variant ?? 'transparent'],
			sizeClasses[size ?? 'md'],
			className
		)
	);
</script>

<Button.Root {...restProps} class={classes}>{@render children()}</Button.Root>
