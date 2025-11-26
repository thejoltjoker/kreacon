<script lang="ts">
	// TODO Disallow sorting to be unselected
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import type { Category } from '$lib/server/db/schema/category';
	import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-svelte';
	import { type PageData } from '../$types';
	import EventCombobox from './EventCombobox.svelte';
	import SortBySelect from '../../_components/SortBySelect.svelte';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { t } from '$lib/i18n';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	const sortByItems: {
		value: string;
		label: string;
		disabled?: boolean;
	}[] = [
		{ label: $t('Newest'), value: 'newest' },
		{ label: $t('Oldest'), value: 'oldest' },
		{ label: $t('Random'), value: 'random' }
		// TODO Sort by reactions count
		// { label: 'Reactions', value: 'reactions' }
	];

	let { categories, events }: { categories: Category[]; events: PageData['events'] } = $props();

	let eventsItems = $derived(
		events.map((e: (typeof events)[number]) => ({ label: e.name, value: e.id.toString() }))
	);

	const handleCategoryChange = (categoryId: number | null) => {
		const params = new SvelteURLSearchParams($page.url.searchParams);
		if (categoryId) {
			params.set('category', categoryId.toString());
		} else {
			params.delete('category');
		}
		// @ts-expect-error TODO Find correct solution to use resolve() with search params
		goto(resolve(`?${params.toString()}`), { keepFocus: true, replaceState: true });
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

<div class="gap-sm pt-xl md:gap-xl flex w-full flex-wrap lg:flex-nowrap">
	<div class="relative shrink grow basis-[640px] overflow-hidden">
		<div
			class:hidden={!canScrollLeft}
			class="justify-left h-form from-bg via-bg absolute top-1/2 left-0 z-10 flex w-[96px] -translate-y-1/2 items-center bg-linear-to-r"
		>
			<Button size="icon" variant="outline" onclick={scrollLeft} class="bg-bg">
				<ChevronLeftIcon />
			</Button>
		</div>
		<div
			class:hidden={!canScrollRight}
			class="h-form from-bg via-bg absolute top-1/2 right-0 z-10 flex w-[96px] -translate-y-1/2 items-center justify-end bg-linear-to-l"
		>
			<Button size="icon" variant="outline" onclick={scrollRight} class="bg-bg">
				<ChevronRightIcon />
			</Button>
		</div>

		<ul
			class="scrollbar-hide gap-sm relative order-1 flex overflow-auto scroll-smooth font-bold"
			bind:this={categoriesListRef}
			onscroll={checkScroll}
		>
			<li
				class="px-md hover:bg-muted-background w-fit rounded-full text-nowrap"
				class:pill={$page.url.searchParams.get('category') == null}
			>
				<button onclick={() => handleCategoryChange(null)}>{$t('All')}</button>
			</li>
			{#each categories as category (category.id)}
				<li>
					<button
						onclick={() => handleCategoryChange(category.id)}
						class="hover:bg-muted-background w-fit text-nowrap"
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
	@reference "../../../../app.css";

	li button {
		@apply h-form px-md flex items-center justify-center rounded-full transition;
	}
	.pill {
		@apply h-form px-md flex items-center justify-center rounded-full bg-white text-black;
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
