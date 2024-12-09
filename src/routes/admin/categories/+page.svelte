<script lang="ts">
	import type { PageData } from './$types';
	import EntityList from '../_components/EntityList.svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';

	export let data: PageData;
</script>

<EntityFilterBar entityName="categories" />
<EntityList items={data.categories} />
<!-- fields={[
		{ name: 'name', showOnMobile: true, sortable: true },
		{ name: 'description', showOnMobile: false, sortable: false },
		{ name: 'slug', showOnMobile: false, sortable: false },
		{ name: 'mediaType', showOnMobile: false, sortable: false }
	]} -->
