<script lang="ts">
	import Pagination from '../../../_components/Pagination.svelte';
	import EntryGrid from '../../../_components/EntryGrid.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<EntryGrid entries={data.entries} />
<Pagination count={data.count} perPage={data.perPage} />
