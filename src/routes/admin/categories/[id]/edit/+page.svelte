<script lang="ts">
	import CategoryForm from '../../_components/CategoryForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>
<CategoryForm data={data.form} />