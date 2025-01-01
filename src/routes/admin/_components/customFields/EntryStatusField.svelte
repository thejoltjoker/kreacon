<script lang="ts">
	import type { EntryStatus } from '$lib/types/entryStatus';
	import capitalize from 'lodash/capitalize';
	import EntityListField from '../EntityListField.svelte';
	import type { Field, Item } from '../types';
	import { CircleAlertIcon, CircleCheckIcon, CircleXIcon } from 'lucide-svelte';

	let { field, item }: { field: Field; item: Item } = $props();
</script>

{#snippet valueSnippet(value: EntryStatus)}
	<p class="inline-flex w-full items-center gap-2xs font-bold">
		<span class="truncate">{capitalize(value)}</span>

		<span
			>{#if value === 'published'}
				<CircleCheckIcon class="size-4 text-primary" />
			{:else if value === 'pending'}
				<CircleAlertIcon class="size-4 text-tertiary" />
			{:else if value === 'rejected'}
				<CircleXIcon class="size-4 text-secondary" />
			{/if}</span
		>
	</p>
{/snippet}
<EntityListField {field} {item} {valueSnippet} />
