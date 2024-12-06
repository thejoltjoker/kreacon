<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<ul class="grid w-full grid-cols-reactions-sm gap-sm">
	{#each data.reactions as reaction}
		<li>
			<a
				href={`/submissions/${reaction.submissionId}`}
				class="group grid aspect-square items-center justify-center gap-sm overflow-hidden rounded-form"
			>
				<img
					src={reaction.submission.thumbnail.url}
					alt=""
					class="col-[1] row-[1] h-full w-full object-cover"
				/>
				<div
					class="relative col-[1] row-[1] flex h-full w-full items-center justify-center bg-black/50 text-[48px] backdrop-blur-sm transition-all group-hover:bg-transparent group-hover:text-3xl group-hover:backdrop-blur-none"
				>
					<!-- {data.profileUser.username} reacted -->
					<p class="font-emoji transition-all group-hover:blur-sm">
						{reaction.value}
					</p>
					<!-- to {reaction.submissionId} -->
				</div>
			</a>
		</li>
	{/each}
</ul>
