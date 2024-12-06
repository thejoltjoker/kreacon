<script lang="ts">
	import type { Category } from '$lib/server/db/schema/category';
	import type { Media } from '$lib/server/db/schema/media';
	import type { Submission } from '$lib/server/db/schema/submission';
	import type { PublicUser } from '$lib/server/db/schema/user';
	import SubmissionGridItem from './SubmissionGridItem.svelte';

	interface Props {
		submissions: (Submission & { category: Category; thumbnail: Media; user: PublicUser })[];
	}

	let { submissions }: Props = $props();
</script>

<div class="grid w-full grid-cols-submissions gap-sm md:gap-xl">
	{#each submissions as submission}
		<SubmissionGridItem {submission} />
	{/each}
</div>
