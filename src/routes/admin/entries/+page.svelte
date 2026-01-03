<script lang="ts">
	import { CircleAlertIcon, CircleCheckIcon, DownloadIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import EntityList from '../_components/EntityList.svelte';
	import type { PageData } from './$types';
	import EventCombobox from '../../(app)/entries/_components/EventCombobox.svelte';
	import type { EntryStatus } from '$lib/types/entryStatus';
	import { invalidateAll } from '$app/navigation';
	import EntryStatusField from '../_components/customFields/EntryStatusField.svelte';

	let { data }: { data: PageData } = $props();

	const handlePublish = async (entry: PageData['entries'][number]) => {
		const status: EntryStatus = 'published';
		await fetch(`/admin/entries/${entry.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ status })
		});
		invalidateAll();
	};
	const handleReject = async (entry: PageData['entries'][number]) => {
		const status: EntryStatus = 'rejected';
		await fetch(`/admin/entries/${entry.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ status })
		});
		invalidateAll();
	};

	const handleDownloadMedia = (entry: PageData['entries'][number]) => {
		if (!entry.mediaUrl) {
			console.warn('No media URL available for entry', entry.id);
			return;
		}
		const link = document.createElement('a');
		link.href = entry.mediaUrl;
		link.download = entry.mediaName ?? `entry-${entry.id}-media`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleDownloadProof = (entry: PageData['entries'][number]) => {
		if (!entry.proofUrl) {
			console.warn('No proof URL available for entry', entry.id);
			return;
		}
		const link = document.createElement('a');
		link.href = entry.proofUrl;
		link.download = entry.proofName ?? `entry-${entry.id}-proof`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
</script>

<EntityFilterBar entityName="entries">
	{#snippet buttons()}
		<EventCombobox
			items={data.events.map((event) => ({ label: event.name, value: event.id.toString() }))}
		/>
	{/snippet}
</EntityFilterBar>
<!-- TODO Show text filter by event -->
<EntityList
	items={data.entries}
	fields={[
		{ name: 'title', minScreen: 'all', sortable: true },
		{ name: 'username', minScreen: 'lg', sortable: true },
		{ name: 'category', minScreen: 'md', sortable: true },
		{ name: 'event', minScreen: 'lg', sortable: true },
		{ name: 'status', minScreen: 'all', sortable: true, customField: EntryStatusField },
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
			label: 'Download media',
			icon: DownloadIcon,
			onClick: (value) => handleDownloadMedia(value)
		},
		{
			label: 'Download proof',
			icon: DownloadIcon,
			onClick: (value) => handleDownloadProof(value),
			isHidden: (entry: PageData['entries'][number]) => !entry.proofUrl
		}
	]}
	pagination={data.pagination}
/>
