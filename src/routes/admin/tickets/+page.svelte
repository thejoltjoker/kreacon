<script lang="ts">
	import { CopyIcon, TrashIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import EntityList from '../_components/EntityList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<EntityFilterBar entityName="tickets" buttons={false} />
<EntityList
	items={data.tickets.map((ticket) => ({
		...ticket,
		username: ticket.user.username,
		email: ticket.user.email,
		event: ticket.event.name
	}))}
	fields={[
		{ name: 'id', minScreen: 'all', sortable: true },
		{ name: 'event', minScreen: 'md', sortable: true },
		{ name: 'email', minScreen: 'lg', sortable: false },
		{ name: 'username', minScreen: 'sm', sortable: true }
	]}
	actions={[
		{ label: 'Copy details', icon: CopyIcon, onClick: (value) => console.log(value) },
		{
			label: 'Delete',
			icon: TrashIcon,
			onClick: (value) => console.log(value),
			class: 'text-destructive'
		}
	]}
/>
