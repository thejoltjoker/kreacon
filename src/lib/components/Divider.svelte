<script lang="ts" module>
	import { type WithChildren } from 'bits-ui';
	import { type VariantProps, tv } from 'tailwind-variants';
	export const dividerVariants = tv({
		base: 'h-px w-full',
		variants: {
			variant: {
				default: 'bg-divider text-muted-foreground',
				white: 'bg-white text-white'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type DividerVariant = VariantProps<typeof dividerVariants>['variant'];

	export type DividerProps = WithChildren & {
		variant?: DividerVariant;
	};
</script>

<script lang="ts">
	import { Separator } from 'bits-ui';
	import { cn } from '$lib/utils';

	let { children, variant = 'default' }: DividerProps = $props();
	let classes = dividerVariants({ variant });
</script>

{#if children}
	<div class="flex h-form items-center gap-sm text-center text-sm">
		<div class={cn('flex-1', classes)}></div>
		{@render children()}
		<div class={cn('flex-1', classes)}></div>
	</div>
{:else}
	<Separator.Root class={cn(classes)} />
{/if}
