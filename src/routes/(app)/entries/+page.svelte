<script lang="ts">
	import { page } from '$app/stores';
	import Avatar from '$lib/components/Avatar.svelte';

	import { t } from '$lib/i18n';
	import Pagination from '../_components/Pagination.svelte';
	import type { PageData } from './$types';
	import FilterBar from './_components/FilterBar.svelte';
	import StatusIcon from './_components/StatusIcon.svelte';

	let { data }: { data: PageData } = $props();

	let entries = $derived(data.entries);
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
	// TODO Show "No entries yet" if there are no entries
</script>

<div class="w-full px-sm md:px-xl">
	<FilterBar {events} {categories} />
</div>
<div class="grid w-full grid-cols-entries gap-sm px-sm md:gap-xl md:px-xl">
	{#each entries as entry}
		<div class="wrapper group grid overflow-hidden rounded-md">
			<div class="aspect-square h-full w-full overflow-hidden rounded-md">
				<a href={`/entries/${entry.id}`}>
					<img
						src={`${entry?.thumbnail?.url}`}
						alt={entry?.title}
						class="h-full w-full object-cover object-center"
					/>
				</a>
			</div>
			<div
				class="items-left pointer-events-none relative flex h-full w-full flex-col justify-between p-sm"
			>
				{#if ['draft', 'pending'].includes(entry.status)}
					<div class="absolute right-sm top-sm">
						<StatusIcon status={entry.status} />
					</div>
				{/if}
				<a
					href={`/users/${entry.user?.username}`}
					class="pointer-events-auto inline-flex h-form w-fit translate-y-0 items-center gap-sm rounded-full p-xs pr-md transition-all duration-300 group-hover:bg-black/75 group-hover:backdrop-blur md:-translate-y-sm md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
				>
					<Avatar
						src={entry.user?.avatar?.url ?? ''}
						username={entry.user?.username ?? $t('Unknown')}
						size="auto"
					/>
					<p>{entry.user?.username}</p>
				</a>
				<div
					class="rounded-md bg-black/75 p-sm backdrop-blur transition-all duration-300 group-hover:backdrop-blur md:translate-y-sm md:bg-none md:opacity-0 md:backdrop-blur-none md:group-hover:translate-y-0 md:group-hover:bg-black/75 md:group-hover:opacity-100"
				>
					<h2 class="text-lg font-bold">{entry.title}</h2>
					<p class="text-shade-300">{entry.category?.name}</p>
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
