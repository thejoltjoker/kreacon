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

<section
	class={cn(
		'gap-xl px-sm flex flex-col items-center justify-center md:flex-row',
		alignment === 'center' && 'flex-col'
	)}
>
	<div
		class={cn(
			'order-1 h-[400px] w-[400px] shrink-0 md:basis-1/2',
			alignment === 'left' && 'order-1',
			alignment === 'right' && 'md:order-2'
		)}
	>
		<img
			src={imageUrl}
			alt={imageAlt}
			{...imageProps}
			width="400"
			height="400"
			class={cn(
				'h-full w-full object-contain object-center',
				flipImageX && 'scale-x-[-1]',
				imageProps?.class
			)}
		/>
	</div>
	<div
		class={cn(
			'gap-xl flex flex-1 flex-col',
			alignment === 'right' && 'order-1',
			alignment === 'left' && 'order-2'
		)}
	>
		{@render content()}
	</div>
</section>
