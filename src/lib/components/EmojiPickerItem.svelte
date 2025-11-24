<script lang="ts">
	import type { Emoji } from '$lib/emojis.svelte';
	import { Command } from 'bits-ui';
	interface EmojiPickerItemProps {
		emoji: Emoji;
		onclick: (emoji: string) => void;
	}
	let { emoji, onclick }: EmojiPickerItemProps = $props();

	const handleClick = () => {
		onclick(emoji.emoji);
	};
</script>

<Command.Item
	class="group min-h-form min-w-form basis-form rounded-form bg-shade-900 data-selected:bg-shade-700 flex aspect-square cursor-pointer items-center justify-center outline-none select-none"
	keywords={emoji.keywords}
	onclick={handleClick}
>
	<div class="group-data-selected:animate-wiggle transition-transform">
		<div class="transition-transform group-data-selected:scale-125">
			<div class="font-emoji translate-y-[2px] text-2xl leading-none">
				{emoji.emoji}
			</div>
		</div>
	</div>
</Command.Item>
