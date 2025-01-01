<script lang="ts">
	import { t } from '$lib/i18n';
	import { cn } from '$lib/utils';
	import startCase from 'lodash/startCase';
	import type { Field, Item } from './types';

	let { field, item }: { field: Field; item: Item } = $props();
	let value = $derived(item[field.name ?? '']);
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
	<p class={cn('w-full truncate text-nowrap font-bold', field?.name === 'id' && 'font-mono')}>
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
