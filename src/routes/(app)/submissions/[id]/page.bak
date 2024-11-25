<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { PageData } from './$types';
	import ReactionsList from './_components/ReactionsList.svelte';
	import SubmissionActions from './_components/SubmissionActions.svelte';
	import SubmissionDetails from './_components/SubmissionDetails.svelte';
	import SubmissionMedia from './_components/SubmissionMedia.svelte';

	export let data: PageData;

	const { submission } = data ?? null;
	const reactions = submission?.reactions ?? [];
	const media = submission?.media;
</script>

<div class="container">
	<section class="media">
		<SubmissionMedia {media} />
	</section>

	<aside class="info">
		<Card>
			<SubmissionDetails {submission} />
			<SubmissionActions />
		</Card>
		<Card>
			<ReactionsList {reactions} />
		</Card>
	</aside>
</div>

<style lang="postcss">
	.container {
		@apply mx-auto flex w-full max-w-full flex-col justify-center gap-sm lg:flex-row;
	}

	.media {
		@apply flex w-full items-center justify-center;
	}

	.info {
		@apply flex w-full max-w-[35rem] flex-col gap-md;
	}
</style>
