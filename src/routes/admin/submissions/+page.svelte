<script lang="ts">
	import { CircleAlertIcon, CircleCheckIcon, TrashIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import EntityList from '../_components/EntityList.svelte';
	import type { PageData } from './$types';
	import EventCombobox from '../../(app)/submissions/_components/EventCombobox.svelte';
	import type { SubmissionStatus } from '$lib/types/submissionStatus';
	import { invalidateAll } from '$app/navigation';
	import DeleteDialog from '$lib/components/DeleteDialog.svelte';

	let { data }: { data: PageData } = $props();
	let submissionToDelete: PageData['submissions'][number] | null = $state(null);
	let deleteDialogOpen = $state(false);
	const handlePublish = async (submission: PageData['submissions'][number]) => {
		const status: SubmissionStatus = 'published';
		await fetch(`/admin/submissions/${submission.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ status })
		});
		invalidateAll();
	};
	const handleReject = async (submission: PageData['submissions'][number]) => {
		const status: SubmissionStatus = 'rejected';
		await fetch(`/admin/submissions/${submission.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ status })
		});
		invalidateAll();
	};

	const handleDelete = async (submission: PageData['submissions'][number]) => {
		await fetch(`/admin/submissions/${submission.id}`, {
			method: 'DELETE'
		});
		deleteDialogOpen = false;
		submissionToDelete = null;
		invalidateAll();
	};
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
		{ name: 'status', minScreen: 'sm', sortable: true },
		{ name: 'createdAt', minScreen: 'xl', sortable: true }
	]}
	actions={[
		{
			label: 'Publish',
			icon: CircleCheckIcon,
			onClick: (value) => handlePublish(value),
			class: '[&_svg]:text-primary'
		},
		{
			label: 'Reject',
			icon: CircleAlertIcon,
			onClick: (value) => handleReject(value),
			class: '[&_svg]:text-secondary'
		},
		{
			label: 'Delete',
			icon: TrashIcon,
			onClick: (value) => {
				submissionToDelete = value;
				deleteDialogOpen = true;
			},
			class: 'text-destructive'
		}
	]}
	pagination={data.pagination}
/>

{#if submissionToDelete}
	<DeleteDialog
		isOpen={deleteDialogOpen}
		entity="submission"
		text="Are you sure you want to delete this submission?"
		confirmationText={submissionToDelete.id}
		onConfirm={() => {
			if (submissionToDelete) handleDelete(submissionToDelete);
		}}
		onCancel={() => {
			deleteDialogOpen = false;
			submissionToDelete = null;
		}}
	/>
{/if}
