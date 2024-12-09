<!-- TODO Pagination -->
<!-- TODO Sorting functionality -->
<!-- TODO Filtering functionality -->
<!-- TODO Custom fields functionality -->
<script lang="ts">
	import { t } from '$lib/i18n';
	import { cn } from '$lib/utils';
	import startCase from 'lodash/startCase';
	import EntityListActions, { type EntityListActionItem } from './EntityListActions.svelte';
	interface Item {
		[key: string]: any;
		id: number | string;
		thumbnailUrl?: string;
	}
	let {
		items,
		fields = [],
		actions = []
	}: { items: Item[]; fields?: string[]; actions?: EntityListActionItem[] } = $props();
</script>

<div class="w-full rounded-form">
	<ul class="users-list flex w-full flex-col">
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
				{#each Object.entries(item) as [key, value]}
					{#if fields.includes(key) || fields.length === 0}
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
								{$t(startCase(key))}
							</p>
						</div>
					{/if}
				{/each}
				<EntityListActions items={actions} />
			</li>
		{/each}
	</ul>
</div>
