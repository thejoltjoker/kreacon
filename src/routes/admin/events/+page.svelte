<script lang="ts">
	import { CircleAlertIcon, CircleCheckIcon, PencilIcon, TrashIcon } from 'lucide-svelte';
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
		'name',
		'slug',
		'submissionsOpenAt',
		'submissionsCloseAt',
		'votingOpenAt',
		'votingCloseAt'
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
