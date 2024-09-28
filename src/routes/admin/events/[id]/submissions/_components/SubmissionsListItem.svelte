<script lang="ts">
	import type { SubmissionWithCategoryMediaReactionsUserVotes } from '$lib/server/db/schema';
	export let submission: SubmissionWithCategoryMediaReactionsUserVotes;
	import { EllipsisIcon, ThumbsUpIcon, SmileIcon } from 'lucide-svelte';
	const { media } = submission;
</script>

<li class="flex-1">
	<div class="flex flex-row items-center gap-md">
		<div
			class="image aspect-square size-thumbnail shrink-0 basis-thumbnail overflow-hidden rounded-md"
		>
			{#if media}
				<img src={media[0]?.url} alt={submission?.title} />
			{:else}
				<img
					src="https://placehold.co/512x512?text=Image"
					alt="Placeholder"
					class="h-full w-full object-cover"
				/>
			{/if}
		</div>
		<div class="flex grow flex-row flex-wrap items-center lg:flex-nowrap">
			<div class="flex w-full grow basis-full flex-col md:basis-1/5">
				<h3 class="text-lg font-bold hover:text-rose-500">
					<a href={`/submissions/${submission.id}`}>{submission.title}</a>
				</h3>
				<p class="subtitle">
					by <span class="text-rose-600">{submission.user?.username}</span>
				</p>
			</div>
			<div class="order-1 flex shrink grow basis-full flex-col lg:order-5 lg:basis-16">
				<p class="title">{submission.category.name}</p>
				<p class="subtitle hidden lg:block">Category</p>
			</div>
			<div class="order-2 flex shrink grow basis-4 items-center gap-xs lg:flex-col lg:items-start">
				<ThumbsUpIcon class="mb-1 size-5 lg:hidden" />
				<p class="title">{submission.votes.length}</p>
				<p class="subtitle hidden lg:block">Votes</p>
			</div>
			<div class="order-2 flex shrink grow basis-4 items-center gap-xs lg:flex-col lg:items-start">
				<SmileIcon class="mb-1 size-5 lg:hidden" />
				<p class="title">{submission.reactions.length}</p>
				<p class="subtitle hidden lg:block">Reactions</p>
			</div>
		</div>
		<div class="flex size-8 min-w-8 items-center justify-center rounded-full border border-white">
			<EllipsisIcon class="size-5" />
		</div>
	</div>
</li>

<style lang="postcss">
	.title {
		@apply text-lg font-bold lg:text-xl;
	}
	.subtitle {
		@apply text-zinc-500;
	}
</style>
