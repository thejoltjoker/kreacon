<script lang="ts">
	import { page } from '$app/stores';
	import Avatar from '$lib/components/Avatar.svelte';
	import Badge from '$lib/components/Badge.svelte';

	import { t } from '$lib/i18n';
	import { cn } from '$lib/utils';
	import { ImageIcon, MusicIcon, VideoIcon } from 'lucide-svelte';
	import Pagination from '../_components/Pagination.svelte';
	import type { PageData } from './$types';
	import FilterBar from './_components/FilterBar.svelte';

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
</script>

<div class="px-sm md:px-xl w-full">
	<FilterBar {events} {categories} />
</div>
{#if entries.length > 0}
	<div class="grid-cols-entries gap-sm px-sm md:gap-xl md:px-xl grid w-full">
		{#each entries as entry (entry.id)}
			<div
				class={cn(
					'wrapper group grid w-full overflow-hidden rounded-md',
					entry.status === 'rejected' && 'border-destructive bg-pomodoro-700 border-2',
					entry.status === 'pending' && 'border-tertiary border-2',
					entry.status === 'draft' && 'border-shade-300 border-2'
				)}
			>
				<div
					class={cn(
						'bg-shade-800 text-shade-300 aspect-square h-full w-full overflow-hidden rounded-md text-center',
						entry.status === 'pending' && 'animate-pulse'
					)}
				>
					<a href={`/entries/${entry.id}`} class="relative flex h-full w-full">
						<span
							class="text-shade-500 absolute z-0 flex h-full w-full items-center justify-center"
						>
							{#if entry.category.mediaType === 'image'}
								<ImageIcon
									class="size-2xl transition-all group-hover:scale-125 group-hover:text-white"
								/>
							{:else if entry.category.mediaType === 'video'}
								<VideoIcon
									class="size-2xl  transition-all group-hover:scale-125 group-hover:text-white"
								/>
							{:else if entry.category.mediaType === 'audio'}
								<MusicIcon
									class="size-2xl  transition-all group-hover:scale-125 group-hover:text-white"
								/>
							{/if}
						</span>
						<!-- Pixelated rendering for Oldschool Graphics category because it's pixel art -->
						<img
							src={`${entry?.preview?.url}`}
							alt={entry?.title}
							class={cn(
								'text-shade-300 z-10 h-full w-full object-cover object-center',
								entry.status === 'rejected' && 'opacity-80 grayscale',
								entry.category?.name?.toLowerCase().includes('oldschool graphics') &&
									'render-pixelated'
							)}
						/>
					</a>
				</div>
				<div
					class="items-left p-sm pointer-events-none relative z-20 flex h-full w-full flex-col justify-between"
				>
					{#if ['draft', 'pending', 'rejected'].includes(entry.status)}
						<div class="right-sm top-sm absolute">
							<Badge
								variant={entry.status === 'draft'
									? 'neutral'
									: entry.status === 'pending'
										? 'tertiary'
										: 'destructive'}
							>
								{entry.status.toUpperCase()}
							</Badge>
						</div>
					{/if}
					<a
						href={`/users/${entry.user?.username}`}
						class="h-form gap-sm p-xs pr-md md:-translate-y-sm pointer-events-auto inline-flex w-fit translate-y-0 items-center rounded-full transition-all duration-300 group-hover:bg-black/75 group-hover:backdrop-blur md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
					>
						<Avatar
							src={entry.user?.avatar?.url ?? ''}
							username={entry.user?.username ?? $t('Unknown')}
							size="auto"
						/>
						<p>{entry.user?.username}</p>
					</a>
					<div
						class="p-sm md:translate-y-sm rounded-md bg-black/75 backdrop-blur transition-all duration-300 group-hover:backdrop-blur md:bg-none md:opacity-0 md:backdrop-blur-none md:group-hover:translate-y-0 md:group-hover:bg-black/75 md:group-hover:opacity-100"
					>
						<h2 class="text-lg font-bold">{entry.title}</h2>
						<p class="text-shade-300">{entry.category?.name}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div
		class="gap-sm flex h-full min-h-[20vh] grow flex-col items-center justify-center text-center"
	>
		<h2>{$t('No entries yet')}</h2>
		<p>{$t('Check back later for new entries!')}</p>
	</div>
{/if}
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
