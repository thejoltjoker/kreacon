<script lang="ts">
	import type { PageData } from './$types';
	import EntityList from '../_components/EntityList.svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';

	export let data: PageData;
</script>

<EntityFilterBar entityName="categories" />
<EntityList items={data.categories} fields={['id', 'name', 'description', 'slug', 'mediaType']} />
