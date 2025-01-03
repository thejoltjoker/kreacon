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

<div class="w-full px-sm md:px-xl">
	<FilterBar {events} {categories} />
</div>
{#if entries.length > 0}
	<div class="grid w-full grid-cols-entries gap-sm px-sm md:gap-xl md:px-xl">
		{#each entries as entry}
			<div
				class={cn(
					'wrapper group grid w-full overflow-hidden rounded-md',
					entry.status === 'rejected' && 'border-2 border-destructive bg-pomodoro-700',
					entry.status === 'pending' && 'border-2 border-tertiary',
					entry.status === 'draft' && 'border-2 border-shade-300'
				)}
			>
				<div
					class={cn(
						'aspect-square h-full w-full overflow-hidden rounded-md bg-shade-800 text-center text-shade-300',
						entry.status === 'pending' && 'animate-pulse'
					)}
				>
					<a href={`/entries/${entry.id}`} class="relative flex h-full w-full">
						<span
							class="absolute z-0 flex h-full w-full items-center justify-center text-shade-500"
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
						<img
							src={`${entry?.preview?.url}`}
							alt={entry?.title}
							class={cn(
								'z-10 h-full w-full object-cover object-center text-shade-300',
								entry.status === 'rejected' && 'opacity-80 grayscale'
							)}
						/>
					</a>
				</div>
				<div
					class="items-left pointer-events-none relative z-20 flex h-full w-full flex-col justify-between p-sm"
				>
					{#if ['draft', 'pending', 'rejected'].includes(entry.status)}
						<div class="absolute right-sm top-sm">
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
{:else}
	<div
		class="flex h-full min-h-[20vh] grow flex-col items-center justify-center gap-sm text-center"
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
