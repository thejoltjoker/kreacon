<script lang="ts">
	import { page } from '$app/stores';
	import Avatar from '$lib/components/Avatar.svelte';

	import { t } from '$lib/i18n';
	import Pagination from '../_components/Pagination.svelte';
	import type { PageData } from './$types';
	import FilterBar from './_components/FilterBar.svelte';
	import StatusIcon from './_components/StatusIcon.svelte';

	let { data }: { data: PageData } = $props();

	let submissions = $derived(data.submissions);
	let categories = $derived(data.categories);
	let events = $derived(data.events);
	let totalCount = $derived(Number(data.totalCount));
	let searchParams = $state(new URLSearchParams($page.url.searchParams.toString()));
	let pageNum = $derived(Number(searchParams.get('page') ?? 1));

	// TODO Showing loading indicators
	// TODO What happens when a page doesn't exist
	// TODO Handling edge cases (first/last page)
	// TODO Recovery from failed requests
	// TODO Combining pagination with filtering/sorting
</script>

<div class="w-full px-sm md:px-xl">
	<FilterBar {events} {categories} />
</div>
<div class="grid w-full grid-cols-submissions gap-sm px-sm md:gap-xl md:px-xl">
	{#each submissions as submission}
		<div class="wrapper group grid overflow-hidden rounded-md">
			<div class="aspect-square h-full w-full overflow-hidden rounded-md">
				<a href={`/submissions/${submission.id}`}>
					{#if submission?.media?.type === 'image'}
						<img
							src={`${submission?.media?.url}`}
							alt={submission?.media?.alt}
							class="h-full w-full object-cover object-center"
						/>
					{:else if submission?.media?.type === 'audio'}
						<img
							src={`/images/music-thumbnail.webp`}
							alt="Audio"
							class="h-full w-full object-cover object-center"
						/>
					{/if}
				</a>
			</div>
			<div
				class="items-left pointer-events-none relative flex h-full w-full flex-col justify-between p-sm"
			>
				{#if ['draft', 'pending'].includes(submission.status)}
					<div class="absolute right-sm top-sm">
						<StatusIcon status={submission.status} />
					</div>
				{/if}
				<a
					href={`/users/${submission.user?.username}`}
					class="pointer-events-auto inline-flex h-form w-fit translate-y-0 items-center gap-sm rounded-full p-xs pr-md transition-all duration-300 group-hover:bg-black/75 group-hover:backdrop-blur md:-translate-y-sm md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
				>
					<Avatar
						src={submission.user?.picture ?? ''}
						username={submission.user?.username ?? $t('Unknown')}
						size="auto"
					/>
					<p>{submission.user?.username}</p>
				</a>
				<div
					class="rounded-md bg-black/75 p-sm backdrop-blur transition-all duration-300 group-hover:backdrop-blur md:translate-y-sm md:bg-none md:opacity-0 md:backdrop-blur-none md:group-hover:translate-y-0 md:group-hover:bg-black/75 md:group-hover:opacity-100"
				>
					<h2 class="text-lg font-bold">{submission.title}</h2>
					<p class="text-muted-foreground">{submission.category?.name}</p>
				</div>
			</div>
		</div>
	{/each}
</div>
<div class="flex w-full items-center justify-center">
	<Pagination page={pageNum} count={totalCount} perPage={30} />
</div>

<style>
	.wrapper {
		display: grid;
		& > * {
			grid-column: 1;
			grid-row: 1;
		}
	}
</style>
