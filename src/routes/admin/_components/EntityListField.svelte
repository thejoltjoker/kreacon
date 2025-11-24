<!-- TODO Better typing -->
<script lang="ts" module>
	type T = unknown;
</script>

<script lang="ts" generics="T extends unknown">
	import { t } from '$lib/i18n';
	import { cn } from '$lib/utils';
	import startCase from 'lodash/startCase';
	import type { Field, Item } from './types';
	import type { Snippet } from 'svelte';
	let {
		field,
		item,
		valueSnippet
	}: { field: Field; item: Item; valueSnippet?: Snippet<[value: T]> } = $props();
	let value: T = $derived(item[field.name ?? ''] as T);
</script>

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
	{#if valueSnippet != null}
		{@render valueSnippet(value)}
	{:else}
		<p class={cn('w-full truncate font-bold text-nowrap', field?.name === 'id' && 'font-mono')}>
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
	{/if}
	<p
		class={cn(
			'font-mo text-shade-400 truncate text-sm tracking-wide',
			field?.name === 'id' && 'text-primary'
		)}
	>
		{startCase($t(field?.name ?? 'Unknown'))}
	</p>
</div>
