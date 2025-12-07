<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { CopyIcon, TrashIcon } from 'lucide-svelte';
	import EventCombobox from '../../(app)/entries/_components/EventCombobox.svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import EntityList from '../_components/EntityList.svelte';
	import type { PageData } from './$types';
	import AlertDialog from '$lib/components/AlertDialog.svelte';

	let { data }: { data: PageData } = $props();

	let ticketToDelete: PageData['tickets'][number] | null = $state(null);
	let showConfirmDialog = $state(false);

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
		showConfirmDialog = false;
		ticketToDelete = null;
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
			onClick: (value) => {
				ticketToDelete = value;
				showConfirmDialog = true;
			},
			class: 'text-destructive'
		}
	]}
	pagination={data.pagination}
/>

{#if ticketToDelete}
	<AlertDialog
		bind:open={showConfirmDialog}
		variant="destructive"
		confirmText="Delete"
		onConfirm={() => {
			if (ticketToDelete) handleDelete(ticketToDelete);
		}}
		onCancel={() => {
			ticketToDelete = null;
		}}
	>
		{#snippet title()}
			Delete ticket
		{/snippet}
		{#snippet description()}
			Are you sure you want to delete <span class="font-bold">{ticketToDelete?.user.username}</span
			>'s ticket for <span class="font-bold">{ticketToDelete?.event}</span>?<br />
			<span class="text-shade-400 font-mono text-sm">ID: {ticketToDelete?.id}</span>
			<br />
			<br />
			<span class="text-shade-400">This action cannot be undone.</span>
		{/snippet}
	</AlertDialog>
{/if}
