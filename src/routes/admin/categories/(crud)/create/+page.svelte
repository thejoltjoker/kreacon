<script lang="ts">
	import CategoryForm from '../_components/CategoryForm.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<!-- TODO Debounce check if category with same name exists and hint user -->
<CategoryForm data={data.form} />
