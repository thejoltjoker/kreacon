<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { CopyIcon, TrashIcon } from 'lucide-svelte';
	import EventCombobox from '../../(app)/submissions/_components/EventCombobox.svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import EntityList from '../_components/EntityList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const handleCopyDetails = (value: PageData['tickets'][number]) => {
		const details = JSON.stringify({
			id: value.id,
			event: value.event.name,
			email: value.user.email,
			username: value.user.username
		});

		navigator.clipboard.writeText(details);
	};

	const handleDelete = async (ticket: PageData['tickets'][number]) => {
		await fetch(`/admin/tickets/${ticket.id}`, {
			method: 'DELETE'
		});
		invalidateAll();
	};
</script>

<EntityFilterBar entityName="tickets">
	{#snippet buttons()}
		<EventCombobox
			items={data.events.map((event) => ({
				label: event.name,
				value: event.id.toString()
			}))}
		/>
	{/snippet}
</EntityFilterBar>
<EntityList
	items={data.tickets.map((ticket) => ({
		...ticket,
		username: ticket.user.username,
		email: ticket.user.email,
		event: ticket.event.name
	}))}
	fields={[
		{ name: 'id', minScreen: 'all', sortable: false },
		{ name: 'event', minScreen: 'md', sortable: false },
		{ name: 'email', minScreen: 'lg', sortable: false },
		{ name: 'username', minScreen: 'sm', sortable: false }
	]}
	actions={[
		{ label: 'Copy details', icon: CopyIcon, onClick: handleCopyDetails },
		{
			label: 'Delete',
			icon: TrashIcon,
			onClick: handleDelete,
			class: 'text-destructive'
		}
	]}
	pagination={data.pagination}
/>
<!-- TODO Make simple confirmation modal -->
