<script lang="ts">
	import type { PageData } from './$types';
	import EntityList from '../_components/EntityList.svelte';
	import { BanIcon, TicketIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { UserStatus } from '$lib/types/userStatus';

	let { data }: { data: PageData } = $props();
	let users = $derived(
		data.users.map((user) => ({
			...user,
			thumbnailUrl: user.avatar?.url ?? '',
			tickets: user.tickets.length,
			entries: user.entries.length
		}))
	);

	const handleBan = async (user: (typeof users)[number]) => {
		const status: UserStatus = 'banned';
		await fetch(`/admin/users/${user.username}`, {
			method: 'PATCH',
			body: JSON.stringify({ status })
		});
		await invalidateAll();
	};
</script>

<EntityFilterBar entityName="users" buttons={false} />
<EntityList
	items={users}
	fields={[
		{ name: 'username', minScreen: 'all', sortable: true },
		{ name: 'email', minScreen: 'sm', sortable: false },
		{ name: 'role', minScreen: 'xl', sortable: true },
		{ name: 'tickets', minScreen: 'lg', sortable: false },
		{ name: 'entries', minScreen: 'md', sortable: false },
		{ name: 'status', minScreen: 'xl', sortable: false },
		{ name: 'createdAt', minScreen: 'xl', sortable: true }
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
			onClick: (value) => handleBan(value),
			class: 'text-destructive'
		}
	]}
	pagination={data.pagination}
/>
