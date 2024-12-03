<script lang="ts">
	// TODO Disallow sorting to be unselected
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Combobox from '$lib/components/Combobox.svelte';
	import Select from '$lib/components/Select.svelte';
	import type { Category } from '$lib/server/db/schema/category';
	import { type PageData } from '../$types';
	import EventCombobox from './EventCombobox.svelte';
	import SortBySelect from './SortBySelect.svelte';

	const sortByItems: {
		value: string;
		label: string;
		disabled?: boolean;
	}[] = [
		{ label: 'Date (asc)', value: 'date_asc' },
		{ label: 'Date (desc)', value: 'date_desc' },
		{ label: 'Random', value: 'random' }
		// TODO Sort by reactions count
		// { label: 'Reactions', value: 'reactions' }
	];

	let { categories, events }: { categories: Category[]; events: PageData['events'] } = $props();

	let eventId = $state<string | undefined>($page.url.searchParams.get('event') ?? undefined);
	let eventsItems = $derived(events.map((e) => ({ label: e.name, value: e.id.toString() })));
	let sortBy = $state<string>($page.url.searchParams.get('sortBy') ?? 'date_asc');

	const handleCategoryChange = (categoryId: number | null) => {
		const params = new URLSearchParams($page.url.searchParams);
		if (categoryId) {
			params.set('category', categoryId.toString());
		} else {
			params.delete('category');
		}
		goto(`?${params.toString()}`, { keepFocus: true });
	};
</script>

<div class="flex w-full flex-wrap gap-sm md:flex-nowrap">
	<div class="relative grow basis-[500px] overflow-hidden lg:shrink">
		<ul class="relative order-1 flex gap-sm overflow-x-scroll md:order-2">
			<li
				class="w-fit text-nowrap hover:bg-muted-background"
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
	<div class="shrink-0 grow basis-[320px] md:grow-0">
		<EventCombobox items={eventsItems} />
	</div>
	<div class="shrink-0 grow basis-[160px] md:grow-0">
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
</style>
