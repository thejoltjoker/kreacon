<script lang="ts">
	import { t } from '$lib/i18n';
	import { cn } from '$lib/utils';
	import { Avatar, type WithoutChildrenOrChild } from 'bits-ui';
	import { UserRoundIcon } from 'lucide-svelte';
	import { tv } from 'tailwind-variants';
	type Props = WithoutChildrenOrChild<Avatar.RootProps> & {
		src: string;
		size?: 'default' | 'auto' | 'sm' | 'md' | 'lg';
		imageRef?: HTMLImageElement | null;
		fallbackRef?: HTMLElement | null;
	} & ({ username: string; alt?: never } | { username?: never; alt: string });

	let {
		src,
		alt,
		username,
		ref = $bindable(null),
		imageRef = $bindable(null),
		fallbackRef = $bindable(null),
		size = 'default',
		class: className,
		...restProps
	}: Props = $props();

	if (username != null) {
		alt = `${username} ${$t('avatar')}`;
	}

	export const variants = tv({
		base: 'border border-muted-foreground rounded-full aspect-square flex items-center justify-center overflow-hidden',
		variants: {
			size: {
				default: 'h-form w-form',
				auto: 'aspect-square max-h-full max-w-full',
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

<Avatar.Root {...restProps} bind:ref class={cn(variants({ size }), className)}>
	<Avatar.Image {src} {alt} bind:ref={imageRef} />
	<Avatar.Fallback bind:ref={fallbackRef}>
		<UserRoundIcon class="h-5 w-5 opacity-50" aria-label="Default user avatar" role="img" />
	</Avatar.Fallback>
</Avatar.Root>
