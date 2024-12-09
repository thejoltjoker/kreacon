<script lang="ts">
	import { PencilIcon, TrashIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import EntityList from '../_components/EntityList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
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
			onClick: (value) => console.log(value)
		},
		{
			label: 'Delete',
			icon: TrashIcon,
			onClick: (value) => console.log(value),
			class: 'text-destructive'
		}
	]}
/>
