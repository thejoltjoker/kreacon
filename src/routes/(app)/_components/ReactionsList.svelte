<script lang="ts">
	import { SmilePlusIcon } from 'lucide-svelte';
	import ReactionsListItem, { type ReactionListItem } from './ReactionsListItem.svelte';
	import EmojiPicker from '$lib/components/EmojiPicker.svelte';
	interface ReactionsListProps {
		reactions: ReactionListItem[];
		onAddReaction: (reaction: string) => void;
	}
	let { reactions, onAddReaction }: ReactionsListProps = $props();
</script>

<ul class="grid w-full grid-cols-reactions-sm gap-sm">
	{#if onAddReaction != null}
		<li>
			<EmojiPicker handleSubmit={onAddReaction}>
				{#snippet trigger(props)}
					<button
						{...props}
						class="group group grid aspect-square h-full w-full items-center justify-center gap-sm overflow-hidden rounded-form border-2 border-dashed border-shade-700 transition-colors hover:border-primary hover:bg-squid-950/50"
					>
						<div
							class="relative col-[1] row-[1] flex h-full w-full items-center justify-center backdrop-blur-sm transition-all group-hover:bg-transparent group-hover:text-3xl group-hover:backdrop-blur-none"
						>
							<SmilePlusIcon
								class="size-10 text-shade-300 transition-all group-hover:scale-110 group-hover:text-white"
							/>
						</div>
					</button>
				{/snippet}
			</EmojiPicker>
		</li>
	{/if}
	{#each reactions as reaction}
		<ReactionsListItem {reaction} />
	{/each}
</ul>
