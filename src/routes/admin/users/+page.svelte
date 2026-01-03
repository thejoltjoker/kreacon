<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import type { UserStatus } from '$lib/types/userStatus';
	import { BanIcon, ShieldIcon, TicketIcon } from 'lucide-svelte';
	import EntityFilterBar from '../_components/EntityFilterBar.svelte';
	import EntityList from '../_components/EntityList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const currentUser = $derived($page.data.user);

	let users = $derived(
		data.users.map((user) => ({
			...user,
			thumbnailUrl: user.avatar?.url ?? '',
			tickets: user.tickets.length,
			entries: user.entries.length
		}))
	);

	const handleToggleBan = async (user: (typeof users)[number]) => {
		const status: UserStatus = user.status === 'banned' ? 'active' : 'banned';
		await fetch(`/admin/users/${user.username}`, {
			method: 'PATCH',
			body: JSON.stringify({ status })
		});
		await invalidateAll();
	};

	const handleToggleAdmin = async (user: (typeof users)[number]) => {
		if (currentUser?.username === user.username) {
			console.error('Cannot toggle your own admin status');
			return;
		}

		if (currentUser?.role === 'admin' && user.role === 'superadmin') {
			console.error('Admin users cannot modify superadmin users');
			return;
		}

		const newRole = user.role === 'admin' ? 'user' : 'admin';
		await fetch(`/admin/users/${user.username}`, {
			method: 'PATCH',
			body: JSON.stringify({ role: newRole })
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
			// @ts-expect-error TODO: Find correct solution to use resolve with search params
			onClick: (value) => goto(resolve(`/admin/tickets?username=${value.username}`))
		},
		{
			label: 'Toggle admin',
			icon: ShieldIcon,
			onClick: (value) => handleToggleAdmin(value),
			isHidden: (user: (typeof users)[number]) =>
				currentUser?.username === user.username ||
				(currentUser?.role === 'admin' && user.role === 'superadmin')
		},
		{
			label: (user: (typeof users)[number]) =>
				user.status === 'banned' ? 'Unban user' : 'Ban user',
			icon: BanIcon,
			onClick: (value) => handleToggleBan(value),
			class: 'text-destructive',
			isHidden: (user: (typeof users)[number]) => currentUser?.username === user.username
		}
	]}
	pagination={data.pagination}
/>
