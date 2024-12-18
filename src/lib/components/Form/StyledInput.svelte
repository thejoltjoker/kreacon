<script lang="ts" module>
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAnchorAttributes, HTMLInputAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';
	import { type Icon as IconType } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	export const inputVariants = tv({
		base: cn('w-full border focus:outline-none'),
		variants: {
			variant: {
				default:
					'focus:border-violet-500 bg-bg focus:ring-violet-500 focus:placeholder:text-shade-600 [&:read-only]:border-shade-400 [&:read-only]:bg-muted-background/50 [&:read-only]:text-shade-400 disabled:border-shade-400 disabled:bg-muted-background/50 disabled:text-shade-400 [&:user-invalid]:border-red-500 [&:user-invalid]:focus:border-red-500 [&:user-invalid]:focus:ring-red-500',
				ghost:
					'!border-transparent bg-transparent rounded-none !p-0 text-shade-400 [&:read-only]:focus:ring-0'
			},
			size: {
				default: 'h-form px-sm rounded-form'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type StyledInputVariant = VariantProps<typeof inputVariants>['variant'];
	export type StyledInputSize = VariantProps<typeof inputVariants>['size'];
	export type StyledInputProps = WithElementRef<HTMLInputAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: StyledInputVariant;
			size?: StyledInputSize;
			icon?: typeof IconType;
		};
</script>

<script lang="ts">
	let {
		value = $bindable(),
		variant,
		size,
		class: className,
		...props
	}: StyledInputProps = $props();
</script>

<input
	bind:value
	class={cn(
		inputVariants({ variant, size }),
		value !== '' && value !== null && 'border-white',
		className
	)}
	{...props}
/>
