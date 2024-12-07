<script lang="ts">
	import { cn } from '$lib/utils';
	import { Label, type LabelRootProps } from 'bits-ui';
	import { type IconProps, type Icon as IconType } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const inputVariants = tv({
		base: 'h-form w-full rounded-sm border px-md focus:outline-none',
		variants: {
			variant: {
				default:
					'focus:border-violet-500 bg-bg focus:ring-violet-500 focus:placeholder:text-muted-background-alt disabled:border-muted-foreground disabled:bg-muted-background',
				ghost: '!border-transparent bg-transparent rounded-none !p-0 text-muted-foreground-alt'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	interface Props extends HTMLInputAttributes {
		label?: string | Snippet;
		labelProps?: Omit<LabelRootProps, 'for'>;
		icon?: typeof IconType;
		iconProps?: IconProps;
		errors?: string[];
		variant?: 'default' | 'ghost';
		inputRef?: HTMLInputElement;
	}

	let {
		type = 'text',
		label,
		labelProps,
		name,
		value = $bindable(),
		icon: Icon,
		errors = [],
		variant = 'default',
		inputRef = $bindable(),
		iconProps,
		...props
	}: Props = $props();
	let className = $derived(
		cn(
			inputVariants({ variant }),
			value != null && value !== '' && variant !== 'ghost'
				? 'border-white'
				: 'border-muted-foreground',
			errors.length > 0 && 'input-invalid',
			props.class
		)
	);
</script>

<div class="relative flex w-full select-text flex-col gap-xs">
	<Label.Root {...labelProps} for={name} class={cn(label == null && 'hidden', labelProps?.class)}>
		{#if typeof label === 'string'}
			<span class="font-bold">{label}</span>
		{:else if label != null}
			{@render label()}
		{/if}
	</Label.Root>
	<span class="relative">
		<input {...props} {type} {name} class={className} bind:value bind:this={inputRef} />
		{#if Icon != null}
			<Icon
				{...iconProps}
				class={cn(
					'absolute right-md top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-all duration-300',
					iconProps?.class
				)}
			/>
		{/if}
	</span>

	{#each errors as error}
		<p class="error">{error}</p>
	{/each}
</div>
