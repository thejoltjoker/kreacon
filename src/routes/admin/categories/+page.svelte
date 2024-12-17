<!-- TODO Layout for form page, i.e create and update -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { PencilIcon, PlusIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import EntityList from '../_components/EntityList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	// TODO Allow admin to archive category
	const handleEdit = (id: string) => {
		goto(`/admin/categories/${id}/edit`);
	};
</script>

<EntityFilterBar entityName="categories">
	{#snippet buttons()}
		<Button href={`/admin/categories/create`} variant="outline" icon={PlusIcon}>
			Add Category
		</Button>
	{/snippet}
</EntityFilterBar>
<EntityList
	items={data.categories}
	fields={[
		{ name: 'name', minScreen: 'all', sortable: true },
		{ name: 'description', minScreen: 'md', sortable: false },
		{ name: 'slug', minScreen: 'lg', sortable: false },
		{ name: 'mediaType', minScreen: 'sm', sortable: true }
	]}
	actions={[
		{
			label: 'Edit',
			icon: PencilIcon,
			onClick: (item) => handleEdit(item.id)
		}
	]}
	pagination={data.pagination}
/>
