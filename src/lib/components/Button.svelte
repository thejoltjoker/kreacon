<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let type: 'button' | 'submit' = 'button';
	export let disabled: boolean = false;
	export let onClick: (event: MouseEvent) => void = () => {};
	export let variant: 'rose' | 'transparent' = 'transparent';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let square: boolean = false;
	export let href: string | undefined = undefined;

	const variants = {
		rose: 'bg-rose-500 text-white border-rose-600 hover:enabled:bg-rose-900/20 transition hover:enabled:border hover:enabled:border-rose-500',
		transparent:
			'bg-transparent dark:text-white dark:border-white dark:hover:enabled:bg-white dark:hover:enabled:text-black'
	};

	const sizeClasses = {
		sm: 'h-button-sm text-sm',
		md: 'h-button-md text-base px-5',
		lg: 'h-button-lg text-lg'
	};

	$: classes = twMerge(
		'relative inline-flex flex-grow items-center justify-center gap-xs rounded-full border font-bold transition-colors disabled:cursor-default disabled:opacity-50',
		variants[variant],
		sizeClasses[size],
		square && 'aspect-square p-0'
	);
</script>

{#if href}
	<a {href} class={classes} on:click={onClick}>
		<slot />
	</a>
{:else}
	<button {type} {disabled} on:click={onClick} class={classes}>
		<slot />
	</button>
{/if}
