<script lang="ts">
	import type { PageData } from './$types';
	import SubmissionsListItem from './_components/SubmissionsListItem.svelte';

	export let data: PageData;
</script>

<ul class="flex w-full flex-col gap-md">
	{#each data.submissions as submission}
		{#if submission.category && submission.media && submission.reactions && submission.user && submission.votes}
			<SubmissionsListItem
				submission={{
					...submission,
					category: submission.category,
					media: [submission.media],
					reactions: submission.reactions,
					user: submission.user,
					votes: submission.votes
				}}
			/>
		{/if}
	{/each}
</ul>
