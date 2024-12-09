<script lang="ts">
	import { CircleAlertIcon, CircleCheckIcon, TrashIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import EntityList from '../_components/EntityList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<EntityFilterBar entityName="submissions" />
<EntityList
	items={data.submissions.flatMap((submission) => ({
		...submission,
		username: submission.user.username,
		thumbnailUrl: submission.thumbnail.url,
		category: submission.category.name
	}))}
	fields={[
		{ name: 'title', minScreen: 'all', sortable: true },
		{ name: 'username', minScreen: 'lg', sortable: false },
		{ name: 'category', minScreen: 'md', sortable: false },
		{ name: 'status', minScreen: 'sm', sortable: false }
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
/>
