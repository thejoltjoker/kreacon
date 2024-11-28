<script lang="ts" module>
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'ring-offset-background font-bold focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0',
		variants: {
			variant: {
				default: 'bg-primary hover:bg-primary/20 border-primary border hover:text-white text-white',
				white:
					'bg-white border-white border text-black hover:text-muted-background hover:bg-muted-background hover:text-white',
				destructive: 'bg-destructive text-destructive hover:bg-destructive/90',
				muted: 'bg-muted-background text-muted-foreground hover:bg-muted-background',
				outline: 'border-white bg-background hover:bg-white hover:text-black border text-white',
				ghost: 'hover:bg-muted-background hover:text-white',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-form px-2xl',
				sm: 'h-sm',
				lg: 'h-lg',
				icon: 'h-form w-form px-0 py-0 overflow-hidden aspect-square'
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
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a bind:this={ref} class={cn(buttonVariants({ variant, size, className }))} {href} {...restProps}>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, className }))}
		{type}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
