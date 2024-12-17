<script lang="ts">
	import type { PageData } from './$types';
	import EntityList from '../_components/EntityList.svelte';
	import { BanIcon, TicketIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const handleBan = (user: User) => {
		console.log(user);
	};
</script>

<EntityFilterBar entityName="users" buttons={false} />
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
		{
			label: 'Show tickets',
			icon: TicketIcon,
			onClick: (value) => goto(`/admin/tickets?username=${value.username}`)
		},
		{
			label: 'Ban user',
			icon: BanIcon,
			onClick: (value) => console.log(value),
			class: 'text-destructive'
		}
	]}
/>
