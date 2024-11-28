<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Select from '$lib/components/Select.svelte';
	import type { Category } from '$lib/server/db/schema/category';

	const options: { label: string; value: string }[] = [
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
		<Select label="Event" items={[]} />
	</div>
	<div class="grow">
		<ul class="flex items-center justify-center gap-xs text-lg font-bold">
			{#each categories as category}
				<li
					class:pill={category.name === $page.url.searchParams.get('category')}
					class="hover:bg-muted-background"
				>
					<button on:click={() => updateQueryParams(category.name)}>
						{category.name}
					</button>
				</li>
			{/each}
		</ul>
	</div>

	<div class="shrink grow basis-1">
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
