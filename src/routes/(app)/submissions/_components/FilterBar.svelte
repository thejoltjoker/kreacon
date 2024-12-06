<script lang="ts">
	// TODO Disallow sorting to be unselected
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Category } from '$lib/server/db/schema/category';
	import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-svelte';
	import { type PageData } from '../$types';
	import EventCombobox from './EventCombobox.svelte';
	import SortBySelect from '../../_components/SortBySelect.svelte';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';

	const sortByItems: {
		value: string;
		label: string;
		disabled?: boolean;
	}[] = [
		{ label: 'Newest', value: 'newest' },
		{ label: 'Oldest', value: 'oldest' },
		{ label: 'Random', value: 'random' }
		// TODO Sort by reactions count
		// { label: 'Reactions', value: 'reactions' }
	];

	let { categories, events }: { categories: Category[]; events: PageData['events'] } = $props();

	let eventsItems = $derived(events.map((e) => ({ label: e.name, value: e.id.toString() })));

	const handleCategoryChange = (categoryId: number | null) => {
		const params = new URLSearchParams($page.url.searchParams);
		if (categoryId) {
			params.set('category', categoryId.toString());
		} else {
			params.delete('category');
		}
		goto(`?${params.toString()}`, { keepFocus: true });
	};

	let categoriesListRef = $state<HTMLElement | null>(null);
	const scrollAmount = 320;

	// Add these new states
	let canScrollLeft = $state(false);
	let canScrollRight = $state(false);

	// Update scroll functions and add check scroll function
	const checkScroll = () => {
		if (!categoriesListRef) return;
		canScrollLeft = categoriesListRef.scrollLeft > 0;
		canScrollRight =
			categoriesListRef.scrollLeft < categoriesListRef.scrollWidth - categoriesListRef.clientWidth;
	};

	const scrollLeft = () => {
		if (!categoriesListRef) return;
		categoriesListRef.scrollLeft -= scrollAmount;
		checkScroll();
	};

	const scrollRight = () => {
		if (!categoriesListRef) return;
		categoriesListRef.scrollLeft += scrollAmount;
		checkScroll();
	};

	onMount(() => {
		checkScroll();
	});
</script>

<div class="flex w-full flex-wrap gap-sm pt-xl md:gap-xl lg:flex-nowrap">
	<div class="relative shrink grow basis-[640px] overflow-hidden">
		<div
			class:hidden={!canScrollLeft}
			class="justify-left absolute left-0 top-1/2 z-10 flex h-form w-[96px] -translate-y-1/2 items-center bg-gradient-to-r from-bg via-bg"
		>
			<Button size="icon" variant="outline" onclick={scrollLeft} class="bg-bg">
				<ChevronLeftIcon />
			</Button>
		</div>
		<div
			class:hidden={!canScrollRight}
			class="absolute right-0 top-1/2 z-10 flex h-form w-[96px] -translate-y-1/2 items-center justify-end bg-gradient-to-l from-bg via-bg"
		>
			<Button size="icon" variant="outline" onclick={scrollRight} class="bg-bg">
				<ChevronRightIcon />
			</Button>
		</div>

		<ul
			class="scrollbar-hide relative order-1 flex gap-sm overflow-auto scroll-smooth font-bold"
			bind:this={categoriesListRef}
			onscroll={checkScroll}
		>
			<li
				class="w-fit text-nowrap rounded-full px-md hover:bg-muted-background"
				class:pill={$page.url.searchParams.get('category') == null}
			>
				<button onclick={() => handleCategoryChange(null)}> All </button>
			</li>
			{#each categories as category}
				<li>
					<button
						onclick={() => handleCategoryChange(category.id)}
						class="w-fit text-nowrap hover:bg-muted-background"
						class:pill={category.id === Number($page.url.searchParams.get('category'))}
					>
						{category.name}
					</button>
				</li>
			{/each}
		</ul>
	</div>
	<div class="shrink-0 grow basis-[320px] lg:grow-0">
		<EventCombobox items={eventsItems} />
	</div>
	<div class="shrink-0 grow basis-[160px] lg:grow-0">
		<SortBySelect items={sortByItems} />
	</div>
</div>

<style lang="postcss">
	li button {
		@apply flex h-form items-center justify-center rounded-full px-md transition;
	}
	.pill {
		@apply flex h-form items-center justify-center rounded-full bg-white px-md text-black;
	}

	/* Add scrollbar hiding utilities */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none; /* Chrome, Safari and Opera */
	}
</style>
