<script lang="ts">
	import Separator from '$lib/components/Separator.svelte';
	import type { PageData } from './$types';
	import SubmissionsListItem from './_components/SubmissionsListItem.svelte';

	export let data: PageData;
</script>

<ul class="flex w-full flex-col gap-md">
	{#each data.submissions as submission}
		<SubmissionsListItem {submission} />
		<Separator color="white" />
	{/each}
</ul>
