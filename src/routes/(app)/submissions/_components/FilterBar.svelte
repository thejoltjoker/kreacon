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

<div class="debug flex w-full flex-wrap gap-sm md:flex-nowrap">
	<div class="debug order-2 w-1/2 grow basis-1/3 md:order-1 md:max-w-[200px]">
		<Select label="Event" items={[]} />
	</div>

	<ul class="debug order-1 flex w-full max-w-full grow gap-sm overflow-x-scroll md:order-2">
		{#each categories as category}
			<li
				class:pill={category.name === $page.url.searchParams.get('category')}
				class="w-fit text-nowrap hover:bg-muted-background"
			>
				<button on:click={() => updateQueryParams(category.name)}>
					{category.name}
				</button>
			</li>
		{/each}
	</ul>

	<div class="debug order-3 w-1/2 grow basis-1/3 md:order-3 md:max-w-[200px]">
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
