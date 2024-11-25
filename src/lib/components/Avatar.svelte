<script lang="ts">
	import { cn } from '$lib/utils';
	import { Avatar, type WithoutChildrenOrChild } from 'bits-ui';
	import { UserRoundIcon } from 'lucide-svelte';
	import { tv } from 'tailwind-variants';
	type Props = WithoutChildrenOrChild<Avatar.RootProps> & {
		src: string;
		alt: string;
		size?: 'default' | 'sm' | 'md' | 'lg';
		imageRef?: HTMLImageElement | null;
		fallbackRef?: HTMLElement | null;
	};

	let {
		src,
		alt,
		ref = $bindable(null),
		imageRef = $bindable(null),
		fallbackRef = $bindable(null),
		size = 'default',
		class: className,
		...restProps
	}: Props = $props();

	export const variants = tv({
		base: 'border border-zinc-500 rounded-full aspect-square flex items-center justify-center overflow-hidden',
		variants: {
			size: {
				default: 'h-form w-form',
				sm: 'h-avatar-sm w-avatar-sm',
				md: 'h-avatar-md w-avatar-md',
				lg: 'h-avatar-lg w-avatar-lg'
			}
		},
		defaultVariants: {
			size: 'default'
		}
	});
</script>

<Avatar.Root {...restProps} bind:ref class={cn(variants({ size, className }))}>
	<Avatar.Image {src} {alt} bind:ref={imageRef} />
	<Avatar.Fallback bind:ref={fallbackRef}>
		<UserRoundIcon class="h-5 w-5 opacity-50" />
	</Avatar.Fallback>
</Avatar.Root>
