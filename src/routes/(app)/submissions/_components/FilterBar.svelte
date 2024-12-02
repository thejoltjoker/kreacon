<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Combobox from '$lib/components/Combobox.svelte';
	import Select from '$lib/components/Select.svelte';
	import type { Category } from '$lib/server/db/schema/category';
	import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-svelte';
	import { type PageData } from '../$types';

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

	let event = $state<string | undefined>($page.url.searchParams.get('event') ?? undefined);
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

	const handleEventChange = (event: string) => {
		// TODO Set event search param
		// TODO Filter categories by event
		const params = new URLSearchParams($page.url.searchParams);
		params.set('event', event);
		goto(`?${params.toString()}`);
	};

	const handleSortByChange = (sortBy: string) => {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('sortBy', sortBy);
		goto(`?${params.toString()}`);
	};
</script>

<div class="flex w-full flex-wrap gap-sm md:flex-nowrap">
	<div
		class="debug order-2 flex-1 shrink grow basis-1 md:order-1 md:min-w-[300px] md:max-w-[300px] md:basis-[300px]"
	>
		<Combobox
			items={eventsItems}
			type="single"
			inputProps={{
				defaultValue: events?.find((e) => e.id === Number(event))?.name ?? '',
				placeholder: 'Filter by event',
				'aria-label': 'Search a fruit'
			}}
			onValueChange={handleEventChange}
			bind:value={event}
		/>
	</div>

	<div
		class="debug relative order-1 flex w-full shrink grow basis-full overflow-hidden md:order-2 md:basis-1/2"
	>
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
	<div
		class="debug order-3 shrink grow basis-1 md:order-3 md:w-[200px] md:min-w-[200px] md:max-w-[200px]"
	>
		<Select items={sortByItems} value={sortBy} onValueChange={handleSortByChange} />
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
