<script lang="ts">
	import { t } from '$lib/i18n';
	import { cn } from '$lib/utils';
	import startCase from 'lodash/startCase';
	import EntityListActions, { type EntityListActionItem } from './EntityListActions.svelte';
	import type { Field, Item } from './types';
	import EntityListField from './EntityListField.svelte';

	let {
		item,
		fieldsToRender,
		hasThumbnail = false,
		actions
	}: {
		item: Item;
		fieldsToRender: Field[];
		hasThumbnail: boolean;
		actions: EntityListActionItem[];
	} = $props();
</script>

<li
	class="flex flex-wrap gap-sm border-b border-b-divider px-xl py-sm first-of-type:pt-sm last-of-type:border-b-0 hover:bg-shade-900"
>
	{#if hasThumbnail}
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
		<EntityListField {field} {item} />
	{/each}
	<EntityListActions {actions} {item} />
</li>
