<script lang="ts">
	import Select from '$lib/components/Select/Select.svelte';
	import type { SelectOptions } from '$lib/components/Select/Select.types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { Category } from '$lib/server/db/schema';

	const options: SelectOptions = [
		{ label: 'Date', value: 'date' },
		{ label: 'Random', value: 'random' },
		{ label: 'Reactions', value: 'reactions' }
	];
	export let categories: Category[];

	function updateQueryParams(category: string) {
		const params = new URLSearchParams($page.url.searchParams);

		params.set('category', category);

		goto(`?${params.toString()}`, { keepFocus: true });
	}
</script>

<div class="flex items-center justify-stretch gap-sm">
	<div class="grow basis-1">
		<Select label="Event" options={[]} selectedLabelPrefix="Event:" />
	</div>
	<div class="grow">
		<ul class="flex items-center justify-center gap-xs text-lg font-bold">
			{#each categories as category}
				<li
					class:pill={category.name === $page.url.searchParams.get('category')}
					class="hover:bg-zinc-800"
				>
					<button on:click={() => updateQueryParams(category.name)}>
						{category.name}
					</button>
				</li>
			{/each}
		</ul>
	</div>

	<div class="shrink grow basis-1">
		<Select label="Sort by" {options} selectedLabelPrefix="Sort by:" />
	</div>
</div>

<style lang="postcss">
	li {
		@apply h-button-md flex items-center justify-center rounded-full px-md transition;
	}
	.pill {
		@apply h-button-md flex items-center justify-center rounded-full bg-white px-md text-black;
	}
</style>
