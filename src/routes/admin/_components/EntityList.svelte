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
	import type { Snippet } from 'svelte';
	import type { Field, Item } from './types';
	import EntityListField from './EntityListHeaderField.svelte';
	import EntityListHeader from './EntityListHeader.svelte';
	import EntityListRow from './EntityListRow.svelte';

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
	let hasThumbnail = $derived(items.some((i) => i.thumbnailUrl));

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
	<EntityListHeader {hasThumbnail} {fieldsToRender} {handleSortByChange} />

	<ul class="entity-list flex w-full flex-col">
		{#each items as item}
			<!-- TODO Render custom fields -->
			<EntityListRow {actions} {item} {fieldsToRender} {hasThumbnail} />
		{/each}
	</ul>
</div>
{#if pagination}
	<Pagination page={pagination.page} perPage={pagination.perPage} count={pagination.count} />
{/if}
