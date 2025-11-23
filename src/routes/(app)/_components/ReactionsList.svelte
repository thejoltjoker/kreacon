<script lang="ts">
	import { page } from '$app/stores';
	import EmojiPicker from '$lib/components/EmojiPicker.svelte';
	import { t } from '$lib/i18n';
	import { SmilePlusIcon } from 'lucide-svelte';
	import ReactionsListItem, { type ReactionListItem } from './ReactionsListItem.svelte';

	interface ReactionsListProps {
		reactions: ReactionListItem[];
		onAddReaction: (reaction: string) => void;
	}
	let { reactions, onAddReaction }: ReactionsListProps = $props();

	type TriggerProps = Record<string, unknown> | undefined;
</script>

<ul class="grid w-full grid-cols-reactions-sm gap-sm">
	{#if onAddReaction != null && $page.data.user != null}
		<li>
			<EmojiPicker handleSubmit={onAddReaction}>
				{#snippet trigger(props: TriggerProps)}
					<button
						{...props}
						id="entry-add-reaction-button"
						class="group group grid aspect-square h-full w-full items-center justify-center gap-sm overflow-hidden rounded-form border-2 border-dashed border-shade-700 transition-colors hover:border-primary hover:bg-squid-950/50"
					>
						<div
							class="relative col-1 row-1 flex h-full w-full items-center justify-center bg-transparent backdrop-blur-sm transition-all group-hover:bg-transparent group-hover:text-3xl group-hover:backdrop-blur-none"
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
	{#if reactions.length === 0 && $page.data.user == null}
		<li class="text-nowrap text-shade-300">
			<p>{$t('No reactions yet, sign in to add yours!')}</p>
		</li>
	{/if}
</ul>
