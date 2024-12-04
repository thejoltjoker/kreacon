<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<main class="flex w-full max-w-screen-lg flex-col gap-8xl pt-xl">
	{#each data.events as event}
		<div>
			<div class="flex items-center justify-between gap-sm">
				<a href="/events/{event.slug}">
					<h2 class="text-4xl">{event.name}</h2>
				</a>
				{#if new Date() >= event.submissionsOpenAt && new Date() <= event.submissionsCloseAt}
					<div class="pill submissions">Submissions Open</div>
				{:else if new Date() >= event.votingOpenAt && new Date() <= event.votingCloseAt}
					<div class="pill voting">Voting Open</div>
				{:else}
					<p class="pill text-sm text-muted-foreground-alt">Closed</p>
				{/if}
			</div>

			<p class="mb-sm text-muted-foreground-alt">{event.description}</p>

			<div class="flex justify-stretch gap-xl">
				<div class="flex flex-1 flex-col">
					<span class="text-sm text-muted-foreground">Submissions Open</span>
					<span class="font-bold">{new Date(event.submissionsOpenAt).toLocaleString()}</span>
				</div>
				<div class="flex flex-1 flex-col">
					<span class="text-sm text-muted-foreground">Submissions Close</span>
					<span class="font-bold">{new Date(event.submissionsCloseAt).toLocaleString()}</span>
				</div>
				<div class="flex flex-1 flex-col">
					<span class="text-sm text-muted-foreground">Voting Open</span>
					<span class="font-bold">{new Date(event.votingOpenAt).toLocaleString()}</span>
				</div>
				<div class="flex flex-1 flex-col">
					<span class="text-sm text-muted-foreground">Voting Close</span>
					<span class="font-bold">{new Date(event.votingCloseAt).toLocaleString()}</span>
				</div>
			</div>
		</div>
	{/each}
</main>

<style lang="postcss">
	.pill {
		@apply rounded-full bg-muted-background px-sm py-xs text-sm font-bold;

		&.submissions {
			@apply bg-secondary text-white;
		}
		&.voting {
			@apply bg-tertiary text-black;
		}
	}
</style>
