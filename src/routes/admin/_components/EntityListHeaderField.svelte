<script lang="ts">
	import { cn } from '$lib/utils';
	import startCase from 'lodash/startCase';
	import type { Field } from './types';
	import { t } from '$lib/i18n';
	import { ArrowUpDownIcon } from 'lucide-svelte';

	let {
		field,
		handleSortByChange
	}: { field: Field; handleSortByChange: (sortBy: string) => void } = $props();
</script>

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
		class="gap-sm hover:text-shade-200 flex items-center overflow-hidden font-bold transition-colors disabled:text-white"
		onclick={() => handleSortByChange(field.name ?? '')}
		disabled={!field.sortable}
	>
		{startCase($t(field.name ?? 'Unknown'))}
		{#if field.sortable}
			<ArrowUpDownIcon class="size-5" />
		{/if}
	</button>
</li>
