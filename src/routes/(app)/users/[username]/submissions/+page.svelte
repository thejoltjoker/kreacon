<script lang="ts">
	import SubmissionGrid from '../../../_components/SubmissionGrid.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SubmissionGrid submissions={data.submissions} />
