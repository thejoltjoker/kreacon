<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Combobox from '$lib/components/Combobox.svelte';
	import Select from '$lib/components/Select.svelte';
	import type { Category } from '$lib/server/db/schema/category';
	import { type PageData } from '../$types';

	const options: { label: string; value: string }[] = [
		{ label: 'Date', value: 'date' },
		{ label: 'Random', value: 'random' },
		{ label: 'Reactions', value: 'reactions' }
	];

	let { categories, events }: { categories: Category[]; events: PageData['events'] } = $props();

	let eventsItems = $derived(events.map((e) => ({ label: e.name, value: e.id.toString() })));
	const handleCategoryChange = (categoryId: number) => {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('category', categoryId.toString());
		goto(`?${params.toString()}`, { keepFocus: true });
	};

	const handleEventChange = (event: string) => {
		// TODO Set event search param
		// TODO Filter categories by event
		const params = new URLSearchParams($page.url.searchParams);
		params.set('event', event);
		goto(`?${params.toString()}`);
	};
</script>

<div class=" flex w-full flex-wrap gap-sm md:flex-nowrap">
	<div class="order-2 w-1/2 grow basis-1/3 md:order-1 md:max-w-[300px]">
		<Combobox
			items={eventsItems}
			type="single"
			inputProps={{ placeholder: 'Filter by event', 'aria-label': 'Search a fruit' }}
			onValueChange={handleEventChange}
		/>
		<!-- <Select label="Event" items={[]} /> -->
	</div>

	<ul class=" order-1 flex w-full max-w-full grow gap-sm overflow-x-scroll md:order-2">
		{#each categories as category}
			<li
				class:pill={category.name === $page.url.searchParams.get('category')}
				class="w-fit text-nowrap hover:bg-muted-background"
			>
				<button onclick={() => handleCategoryChange(category.id)}>
					{category.name}
				</button>
			</li>
		{/each}
	</ul>

	<div class=" order-3 w-1/2 grow basis-1/3 md:order-3 md:max-w-[200px]">
		<Select label="Sort by" items={options} />
	</div>
</div>

<style lang="postcss">
	li {
		@apply flex h-input-md items-center justify-center rounded-full px-md transition;
	}
	.pill {
		@apply flex h-input-md items-center justify-center rounded-full bg-white px-md text-black;
	}
</style>
