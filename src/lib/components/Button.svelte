<!-- TODO Change ring on focus -->
<script lang="ts" module>
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';
	import { type Icon as IconType } from 'lucide-svelte';
	export const buttonVariants = tv({
		base: 'ring-offset-shade-900 font-bold inline-flex items-center transition-colors justify-center gap-2 whitespace-nowrap rounded-button transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0',
		variants: {
			variant: {
				default:
					'bg-primary hover:bg-primary/20 border-primary border hover:text-white text-white ring-shade-400',
				white:
					'bg-white border-white border text-black hover:text-muted-background hover:bg-muted-background hover:text-white',
				destructive:
					'bg-destructive text-black ring-shade-400 hover:bg-destructive/20 border-destructive border hover:text-white',
				muted: 'bg-shade-700 text-white hover:text-white hover:bg-shade-400 ring-shade-400',
				outline: 'border-white bg-background hover:bg-white hover:text-black border text-white',
				ghost: 'hover:bg-muted-background hover:text-white ring-shade-400',
				link: 'text-primary underline-offset-4 hover:underline',
				neutral: 'bg-inherit text-inherit h-fit rounded-none !p-0'
			},
			size: {
				default: 'h-form px-2xl',
				sm: 'h-sm',
				lg: 'h-lg',
				icon: 'h-form w-form px-0 py-0 overflow-hidden aspect-square',
				'square-form': 'h-form w-form px-0 py-0 overflow-hidden aspect-square rounded-form'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
			icon?: typeof IconType;
		};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		children,
		icon: Icon = undefined,
		...props
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		class={cn(buttonVariants({ variant, size }), Icon && 'pl-lg', className)}
		{href}
		{...props}
	>
		{#if Icon}
			<Icon />
		{/if}
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size }), Icon && 'pl-lg', className)}
		{type}
		{...props}
	>
		{#if Icon}
			<Icon />
		{/if}
		{@render children?.()}
	</button>
{/if}
