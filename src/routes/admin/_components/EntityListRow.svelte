<script lang="ts">
	import { t } from '$lib/i18n';
	import EntityListActions, { type EntityListActionItem } from './EntityListActions.svelte';
	import EntityListField from './EntityListField.svelte';
	import type { Field, Item } from './types';

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
	class="gap-sm border-b-divider px-xl py-sm first-of-type:pt-sm hover:bg-shade-900 flex flex-wrap border-b last-of-type:border-b-0"
>
	{#if hasThumbnail}
		<div
			class="size-form min-w-form rounded-form outline-shade-700 flex items-center justify-center overflow-hidden outline outline-[1px] outline-offset-2"
		>
			<img
				src={item.thumbnailUrl}
				alt={item.name ?? $t('Thumbnail')}
				class="h-full w-full object-cover"
			/>
		</div>
	{/if}
	{#each fieldsToRender as field (field.name)}
		{#if field.customField}
			{@const CustomField = field.customField}
			<CustomField {field} {item} />
		{:else}
			<EntityListField {field} {item} />
		{/if}
	{/each}
	<EntityListActions {actions} {item} />
</li>
