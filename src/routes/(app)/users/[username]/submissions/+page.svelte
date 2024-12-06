<script lang="ts">
	import Pagination from '../../../_components/Pagination.svelte';
	import SubmissionGrid from '../../../_components/SubmissionGrid.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SubmissionGrid submissions={data.submissions} />
<Pagination count={data.count} perPage={data.perPage} />
