<script lang="ts">
	import type { PageData } from './$types';
	import EntityList from '../_components/EntityList.svelte';
	import { BanIcon, TicketIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';

	export let data: PageData;
</script>

<EntityFilterBar entityName="users" />
<EntityList
	items={data.users.map((user) => ({
		...user,
		thumbnailUrl: user.picture ?? '',
		tickets: user.tickets.length,
		submissions: user.submissions.length
	}))}
	fields={[
		{ name: 'username', minScreen: 'all', sortable: true },
		{ name: 'email', minScreen: 'sm', sortable: false },
		{ name: 'role', minScreen: 'xl', sortable: false },
		{ name: 'tickets', minScreen: 'lg', sortable: false },
		{ name: 'submissions', minScreen: 'md', sortable: false }
	]}
	actions={[
		{ label: 'Show tickets', icon: TicketIcon, onClick: (value) => console.log(value) },
		{
			label: 'Ban user',
			icon: BanIcon,
			onClick: (value) => console.log(value),
			class: 'text-destructive'
		}
	]}
/>
