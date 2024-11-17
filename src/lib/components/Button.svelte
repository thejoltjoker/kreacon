<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { createEventDispatcher } from 'svelte';

	export let type: 'button' | 'submit' = 'button';
	export let disabled: boolean = false;
	export let variant: 'rose' | 'transparent' = 'transparent';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let square: boolean = false;
	export let href: string | undefined = undefined;
	let className: string | undefined = undefined;
	export { className as class };

	const dispatch = createEventDispatcher();

	const dispatch = createEventDispatcher();

	const variants = {
		rose: 'bg-rose-500 text-white border-rose-600 hover:enabled:bg-rose-900/20 transition hover:enabled:border hover:enabled:border-rose-500',
		transparent:
			'bg-transparent dark:text-white dark:border-white dark:hover:enabled:bg-white dark:hover:bg-white dark:hover:enabled:text-black dark:hover:text-black'
	};

	const sizeClasses = {
		sm: 'h-button-sm text-sm px-md',
		md: 'h-button-md text-base px-5',
		lg: 'h-button-lg text-lg px-5'
	};

	$: classes = twMerge(
		'relative inline-flex flex-grow items-center justify-center gap-xs rounded-full border font-bold transition-colors disabled:cursor-default disabled:opacity-50',
		variants[variant],
		sizeClasses[size],
		square && 'aspect-square p-0 flex-grow-0',
		className
	);
</script>

{#if href}
	<a {href} class={classes}>
		<slot />
	</a>
{:else}
	<button {type} {disabled} on:click={(e) => dispatch('click', e)} class={classes}>
		<slot />
	</button>
{/if}
