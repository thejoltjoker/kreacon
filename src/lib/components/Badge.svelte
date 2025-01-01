<!-- TODO Change ring on focus -->
<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';
	export const badgeVariants = tv({
		base: 'font-bold transition-colors h-fit w-fit whitespace-nowrap rounded-full border flex items-center justify-center badge',
		variants: {
			variant: {
				default: 'bg-white text-black border-black',
				primary: 'bg-primary text-white border-squid-950',
				secondary: 'bg-secondary text-white border-bubblegum-950',
				tertiary: 'bg-tertiary text-sun-950 border-sun-950',
				destructive: 'bg-destructive text-pomodoro-950 border-pomodoro-950',
				success: 'bg-success text-mint-950 border-mint-950',
				neutral: 'bg-shade-700 text-white border-border-shade-800'
			},
			outlined: {
				true: 'border bg-transparent border-white text-white'
			},
			size: {
				sm: 'px-xs text-xs font-normal',
				md: 'px-xs text-sm',
				lg: 'px-sm text-sm py-3xs',
				form: 'h-form px-lg'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
			outlined: false
		},
		compoundVariants: [
			{ outlined: true, variant: 'primary', class: 'border-primary text-white' },
			{ outlined: true, variant: 'secondary', class: 'border-secondary text-white' },
			{ outlined: true, variant: 'tertiary', class: 'border-tertiary text-white' },
			{ outlined: true, variant: 'destructive', class: 'border-destructive text-white' },
			{ outlined: true, variant: 'success', class: 'border-success text-white' },
			{ outlined: true, variant: 'neutral', class: 'border-border-shade-700 text-white' }
		]
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
	export type BadgeSize = VariantProps<typeof badgeVariants>['size'];
	export type BadgeOutlined = VariantProps<typeof badgeVariants>['outlined'];
	export type BadgeProps = HTMLAttributes<HTMLDivElement> & {
		variant?: BadgeVariant;
		size?: BadgeSize;
		outlined?: BadgeOutlined;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		variant = 'default',
		size = 'md',
		outlined = false,
		children,
		...props
	}: BadgeProps = $props();
</script>

<div class={cn(badgeVariants({ variant, size, outlined }), className)} {...props}>
	{@render children?.()}
</div>
