<script lang="ts">
	import type { PageData } from './$types';
	import EntityList from '../_components/EntityList.svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';

	export let data: PageData;
</script>

<EntityFilterBar entityName="categories" />
<EntityList
	items={data.categories}
	fields={[
		{ name: 'name', minScreen: 'all', sortable: true },
		{ name: 'description', minScreen: 'md', sortable: false },
		{ name: 'slug', minScreen: 'lg', sortable: false },
		{ name: 'mediaType', minScreen: 'sm', sortable: false }
	]}
/>
