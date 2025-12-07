<script lang="ts">
	import type { Category } from '$lib/server/db/schema/category';
	import type { SelectFile } from '$lib/server/db/schema/file';
	import type { Entry } from '$lib/server/db/schema/entry';
	import type { PublicUser } from '$lib/server/db/schema/user';
	import EntryGridItem from './EntryGridItem.svelte';

	interface Props {
		entries: (Entry & { category: Category; preview: SelectFile; user: PublicUser })[];
	}

	let { entries }: Props = $props();
</script>

<div class="grid-cols-entries gap-sm md:gap-xl grid w-full">
	{#each entries as entry (entry.id)}
		<EntryGridItem {entry} />
	{/each}
</div>
