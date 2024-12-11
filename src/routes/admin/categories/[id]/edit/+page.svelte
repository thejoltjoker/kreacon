<script lang="ts">
	import CategoryForm from '../../_components/CategoryForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex w-full max-w-screen-md">
	<CategoryForm data={data.form} />
</div>
