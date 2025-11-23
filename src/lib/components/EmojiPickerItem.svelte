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
	class="group flex aspect-square min-h-form min-w-form basis-form cursor-pointer select-none items-center justify-center rounded-form bg-shade-900 outline-none data-selected:bg-shade-700"
	keywords={emoji.keywords}
	onclick={handleClick}
>
	<div class="transition-transform group-data-selected:animate-wiggle">
		<div class="transition-transform group-data-selected:scale-125">
			<div class="translate-y-[2px] font-emoji text-2xl leading-none">
				{emoji.emoji}
			</div>
		</div>
	</div>
</Command.Item>
