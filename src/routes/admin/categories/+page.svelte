<!-- TODO Layout for form page, i.e create and update -->
<script lang="ts">
	import type { PageData } from './$types';
	import EntityList from '../_components/EntityList.svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import { goto, invalidateAll } from '$app/navigation';

	export let data: PageData;
	const handleDelete = async (id: string) => {
		// TODO Add confirmation dialog

		await fetch(`/admin/categories/${id}`, { method: 'DELETE' });
		invalidateAll();
	};

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
		},
		{
			label: 'Delete',
			icon: TrashIcon,
			onClick: (item) => handleDelete(item.id),
			class: 'text-destructive'
		}
	]}
	pagination={data.pagination}
/>
