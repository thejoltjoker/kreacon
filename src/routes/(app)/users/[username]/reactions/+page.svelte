<script lang="ts">
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<ul class="grid-cols-reactions-sm gap-sm grid w-full">
	{#each data.reactions as reaction (`${reaction.userId}-${reaction.entryId}-${reaction.value}`)}
		<li>
			<a
				href={`/entries/${reaction.entryId}`}
				class="group gap-sm rounded-form grid aspect-square items-center justify-center overflow-hidden"
			>
				<img
					src={reaction.entry?.preview?.url}
					alt=""
					class={cn(
						'col-1 row-1 h-full w-full object-cover',
						reaction.entry?.category?.name?.toLowerCase().includes('oldschool graphics') &&
							'render-pixelated'
					)}
				/>
				<div
					class="relative col-1 row-1 flex h-full w-full items-center justify-center bg-black/50 text-[48px] backdrop-blur-sm transition-all group-hover:bg-transparent group-hover:text-3xl group-hover:backdrop-blur-none"
				>
					<p class="font-emoji transition-all group-hover:blur-sm">
						{reaction.value}
					</p>
				</div>
			</a>
		</li>
	{/each}
</ul>
