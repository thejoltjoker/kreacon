<script lang="ts">
	import { CircleAlertIcon, CircleCheckIcon, TrashIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import EntityList from '../_components/EntityList.svelte';
	import type { PageData } from './$types';
	import EventCombobox from '../../(app)/submissions/_components/EventCombobox.svelte';

	let { data }: { data: PageData } = $props();
</script>

<!-- TODO Figure out what to do when deleting category -->
<EntityFilterBar entityName="submissions">
	{#snippet buttons()}
		<EventCombobox
			items={data.events.map((event) => ({ label: event.name, value: event.id.toString() }))}
		/>
	{/snippet}
</EntityFilterBar>
<!-- TODO Show text filter by event -->
<EntityList
	items={data.submissions}
	fields={[
		{ name: 'title', minScreen: 'all', sortable: true },
		{ name: 'username', minScreen: 'lg', sortable: true },
		{ name: 'category', minScreen: 'md', sortable: true },
		{ name: 'event', minScreen: 'lg', sortable: true },
		{ name: 'status', minScreen: 'sm', sortable: true }
	]}
	actions={[
		{
			label: 'Approve',
			icon: CircleCheckIcon,
			onClick: (value) => console.log(value),
			class: '[&_svg]:text-primary'
		},
		{
			label: 'Deny',
			icon: CircleAlertIcon,
			onClick: (value) => console.log(value),
			class: '[&_svg]:text-secondary'
		},
		{
			label: 'Delete',
			icon: TrashIcon,
			onClick: (value) => console.log(value),
			class: 'text-destructive'
		}
	]}
	pagination={data.pagination}
/>
