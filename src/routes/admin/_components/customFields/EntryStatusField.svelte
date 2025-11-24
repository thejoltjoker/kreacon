<script lang="ts">
	import type { EntryStatus } from '$lib/types/entryStatus';
	import capitalize from 'lodash/capitalize';
	import EntityListField from '../EntityListField.svelte';
	import type { Field, Item } from '../types';
	import { CircleAlertIcon, CircleCheckIcon, CircleXIcon } from 'lucide-svelte';

	let { field, item }: { field: Field; item: Item } = $props();
</script>

{#snippet valueSnippet(value: EntryStatus)}
	<p class="gap-2xs inline-flex w-full items-center font-bold">
		<span class="truncate">{capitalize(value)}</span>

		<span
			>{#if value === 'published'}
				<CircleCheckIcon class="text-primary size-4" />
			{:else if value === 'pending'}
				<CircleAlertIcon class="text-tertiary size-4" />
			{:else if value === 'rejected'}
				<CircleXIcon class="text-secondary size-4" />
			{/if}</span
		>
	</p>
{/snippet}
<EntityListField {field} {item} {valueSnippet} />
