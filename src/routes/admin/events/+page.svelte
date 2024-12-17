<script lang="ts">
	import { goto } from '$app/navigation';
	import { PencilIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import EntityList from '../_components/EntityList.svelte';
	import type { PageData } from './$types';
	// TODO Allow admin to archive event
	let { data }: { data: PageData } = $props();

	const handleEdit = (id: string) => {
		goto(`/admin/events/${id}/edit`);
	};
</script>

<EntityFilterBar entityName="events" />
<EntityList
	items={data.events.flatMap((event) => ({
		...event
	}))}
	fields={[
		{ name: 'name', minScreen: 'all', sortable: true },
		{ name: 'slug', minScreen: 'xl', sortable: false },
		{ name: 'submissionsOpenAt', minScreen: 'sm', sortable: false },
		{ name: 'submissionsCloseAt', minScreen: 'lg', sortable: false },
		{ name: 'votingOpenAt', minScreen: 'sm', sortable: false },
		{ name: 'votingCloseAt', minScreen: 'lg', sortable: false }
	]}
	actions={[
		{
			label: 'Edit',
			icon: PencilIcon,
			onClick: (item) => handleEdit(item.id)
		}
	]}
/>
