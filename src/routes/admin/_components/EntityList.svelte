<!-- TODO Pagination -->
<!-- TODO Sorting functionality -->
<!-- TODO Filtering functionality -->
<!-- TODO Custom fields functionality -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { cn } from '$lib/utils';
	import startCase from 'lodash/startCase';
	import { ArrowUpDownIcon, ImageIcon, Settings2Icon } from 'lucide-svelte';
	import EntityListActions, { type EntityListActionItem } from './EntityListActions.svelte';
	interface Item {
		[key: string]: unknown;
		id: number | string;
		thumbnailUrl?: string;
	}
	let {
		items,
		fields = [],
		actions = []
	}: { items: Item[]; fields?: string[]; actions?: EntityListActionItem[] } = $props();

	let fieldsToRender = $derived(
		fields.length > 0
			? fields.map((field) => [field, null])
			: Object.keys(items[0] || {}).map((field) => [field, null])
	);

	$effect(() => {
		console.log(fieldsToRender);
	});

	const handleSortByChange = (sortBy: string) => {
		const params = new URLSearchParams($page.url.searchParams);
		if (params.get('sortBy') === `${sortBy}_asc`) {
			params.set('sortBy', `${sortBy}_desc`);
		} else {
			params.set('sortBy', `${sortBy}_asc`);
		}
		goto(`?${params.toString()}`);
	};
</script>

<div class="w-full rounded-form">
	<ul
		class="flex flex-wrap gap-sm border-b border-b-divider px-xl py-sm first-of-type:pt-sm last-of-type:border-b-0 hover:bg-shade-900"
	>
		{#if items.some((i) => i.thumbnailUrl)}
			<div
				class="flex size-form min-w-form items-center justify-center overflow-hidden text-shade-400"
			>
				<ImageIcon class="size-5" />
			</div>
		{/if}
		{#each fieldsToRender as [key]}
			<li class="flex flex-1 items-center">
				<button
					class="flex items-center gap-sm overflow-hidden font-bold transition-colors hover:text-shade-200"
					onclick={() => handleSortByChange(key ?? '')}
				>
					{startCase(key ?? 'Unknown')}
					<ArrowUpDownIcon class="size-5" />
				</button>
			</li>
		{/each}
		<li class="flex size-form items-center justify-center text-shade-400">
			<Settings2Icon class="size-5" />
		</li>
	</ul>
	<ul class="entity-list flex w-full flex-col">
		{#each items as item}
			<li
				class="flex flex-wrap gap-sm border-b border-b-divider px-xl py-sm first-of-type:pt-sm last-of-type:border-b-0 hover:bg-shade-900"
			>
				{#if items.some((i) => i.thumbnailUrl)}
					<div
						class="flex size-form min-w-form items-center justify-center overflow-hidden rounded-form outline outline-[1px] outline-offset-2 outline-shade-700"
					>
						<img src={item.thumbnailUrl} alt={item.name} class="h-full w-full object-cover" />
					</div>
				{/if}
				{#each fieldsToRender as [key]}
					{@const value = item[key]}
					<div
						class={cn(
							'flex flex-1 flex-col items-start overflow-hidden text-left',
							key === 'id' && 'min-w-fit'
						)}
					>
						<p class={cn('w-full truncate text-nowrap font-bold', key === 'id' && 'font-mono')}>
							{#if value instanceof Date}
								{value.toLocaleString('en-GB', {
									hour: '2-digit',
									minute: '2-digit',
									day: '2-digit',
									month: 'short',
									year: 'numeric'
								})}
							{:else}
								{value}
							{/if}
						</p>
						<p
							class={cn(
								'font-mo truncate text-sm tracking-wide text-shade-400',
								key === 'id' && 'text-primary'
							)}
						>
							{$t(startCase(key ?? 'Unknown'))}
						</p>
					</div>
				{/each}
				<EntityListActions items={actions} />
			</li>
		{/each}
	</ul>
</div>
