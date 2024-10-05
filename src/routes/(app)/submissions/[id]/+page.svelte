<script lang="ts">
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
		<SubmissionDetails {submission} />
		<SubmissionActions {submission} />
		<ReactionsList {reactions} />
	</aside>
</div>

<style lang="postcss">
	.container {
		@apply mx-auto flex w-full max-w-full flex-col justify-center gap-sm lg:flex-row;
	}

	.media {
		@apply w-fit;
	}

	.info {
		@apply lg:min-w-sidebar-lg lg:max-w-sidebar-lg flex w-full flex-col gap-sm;
	}
</style>
