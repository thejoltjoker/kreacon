<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLImgAttributes } from 'svelte/elements';

	let {
		content,
		alignment,
		imageUrl,
		imageAlt,
		imageProps,
		flipImageX = false
	}: {
		content: Snippet;
		alignment: 'left' | 'center' | 'right';
		imageUrl: string;
		imageAlt: string;
		imageProps?: Omit<HTMLImgAttributes, 'src' | 'alt'>;
		flipImageX?: boolean;
	} = $props();
</script>

<section class={cn('flex items-center gap-xl', alignment === 'center' && 'flex-col')}>
	<div
		class={cn(
			'h-[400px] flex-1 overflow-hidden rounded-lg',
			alignment === 'left' && 'order-1',
			alignment === 'right' && 'order-2'
		)}
	>
		<img
			src={imageUrl}
			alt={imageAlt}
			{...imageProps}
			class={cn(
				'h-full w-full object-contain object-center',
				flipImageX && 'scale-x-[-1]',
				imageProps?.class
			)}
		/>
	</div>
	<div
		class={cn(
			'flex flex-1 flex-col gap-xl',
			alignment === 'right' && 'order-1',
			alignment === 'left' && 'order-2'
		)}
	>
		{@render content()}
	</div>
</section>
