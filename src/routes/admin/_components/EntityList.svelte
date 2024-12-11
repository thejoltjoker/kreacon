<!-- TODO Pagination -->
<!-- TODO Filtering functionality -->
<!-- TODO Custom fields functionality -->
<!-- TODO Refactor header component -->
<!-- TODO Change icon when sorting -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { cn } from '$lib/utils';
	import startCase from 'lodash/startCase';
	import { ArrowUpDownIcon, ImageIcon, Settings2Icon } from 'lucide-svelte';
	import Pagination from '../../(app)/_components/Pagination.svelte';
	import EntityListActions, { type EntityListActionItem } from './EntityListActions.svelte';
	interface Item {
		[key: string]: unknown;
		id: number | string;
		thumbnailUrl?: string;
		name?: string;
	}

	interface Field {
		name: string;
		minScreen: 'all' | 'sm' | 'md' | 'lg' | 'xl';
		sortable: boolean;
	}

	interface EntityListProps {
		items: Item[];
		fields?: Field[];
		actions?: EntityListActionItem[];
		pagination?: { page: number; perPage: number; count: number };
	}

	let { items, fields = [], actions = [], pagination }: EntityListProps = $props();

	let fieldsToRender: Field[] = $derived(
		fields.length > 0
			? fields
			: Object.entries(items[0] || {}).map(([field, _]) => ({
					name: field,
					minScreen: 'all',
					sortable: false
				}))
	);

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
				<ImageIcon class="size-5" aria-label={$t('image')} />
			</div>
		{/if}
		{#each fieldsToRender as field}
			<li
				class={cn(
					'flex flex-1 items-center',
					field.minScreen === 'all' && 'flex',
					field.minScreen === 'sm' && 'max-sm:hidden',
					field.minScreen === 'md' && 'max-md:hidden',
					field.minScreen === 'lg' && 'max-lg:hidden',
					field.minScreen === 'xl' && 'max-xl:hidden'
				)}
			>
				<button
					class="flex items-center gap-sm overflow-hidden font-bold transition-colors hover:text-shade-200 disabled:text-white"
					onclick={() => handleSortByChange(field.name ?? '')}
					disabled={!field.sortable}
				>
					{startCase($t(field.name ?? 'Unknown'))}
					{#if field.sortable}
						<ArrowUpDownIcon class="size-5" />
					{/if}
				</button>
			</li>
		{/each}
		<li class="flex size-form items-center justify-center text-shade-400">
			<Settings2Icon class="size-5" />
		</li>
	</ul>

	<ul class="entity-list flex w-full flex-col">
		{#each items as item}
			<!-- TODO Make component -->
			<li
				class="flex flex-wrap gap-sm border-b border-b-divider px-xl py-sm first-of-type:pt-sm last-of-type:border-b-0 hover:bg-shade-900"
			>
				{#if items.some((i) => i.thumbnailUrl)}
					<div
						class="flex size-form min-w-form items-center justify-center overflow-hidden rounded-form outline outline-[1px] outline-offset-2 outline-shade-700"
					>
						<img
							src={item.thumbnailUrl}
							alt={item.name ?? $t('Thumbnail')}
							class="h-full w-full object-cover"
						/>
					</div>
				{/if}
				{#each fieldsToRender as field}
					{@const value = item[field.name ?? '']}
					<div
						class={cn(
							'flex flex-1 flex-col items-start overflow-hidden text-left',
							field.minScreen === 'all' && 'flex',
							field.minScreen === 'sm' && 'max-sm:hidden',
							field.minScreen === 'md' && 'max-md:hidden',
							field.minScreen === 'lg' && 'max-lg:hidden',
							field.minScreen === 'xl' && 'max-xl:hidden',
							field?.name === 'id' && 'min-w-fit'
						)}
					>
						<p
							class={cn(
								'w-full truncate text-nowrap font-bold',
								field?.name === 'id' && 'font-mono'
							)}
						>
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
								field?.name === 'id' && 'text-primary'
							)}
						>
							{startCase($t(field?.name ?? 'Unknown'))}
						</p>
					</div>
				{/each}
				<EntityListActions {actions} {item} />
			</li>
		{/each}
	</ul>
</div>
{#if pagination}
	<Pagination page={pagination.page} perPage={pagination.perPage} count={pagination.count} />
{/if}
