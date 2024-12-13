<script lang="ts">
	import { page } from '$app/stores';

	import {
		LayoutGridIcon,
		LogOutIcon,
		ShieldIcon,
		TicketIcon,
		UserCircle,
		UserCircleIcon,
		type Icon as IconType
	} from 'lucide-svelte';
	import Avatar from './Avatar.svelte';
	import DropdownMenuItem from './DropdownMenuItem.svelte';
	import DropdownMenu from './DropdownMenu.svelte';
	import DropdownMenuSeparator from './DropdownMenuSeparator.svelte';

	type MenuItem =
		| {
				label: string;
				href: string;
				icon: typeof IconType;
		  }
		| 'divider';

	const user = $derived($page.data.user);

	const menuItems: MenuItem[] = [
		{
			label: 'Profile',
			href: '/profile',
			icon: UserCircleIcon
		},
		{
			label: 'Submissions',
			href: `/users/${$page.data.user?.username}`,
			icon: LayoutGridIcon
		},
		{
			label: 'Tickets',
			href: '/profile#tickets',
			icon: TicketIcon
		},
		'divider',
		{
			label: 'Sign out',
			href: '/logout',
			icon: LogOutIcon
		}
	];
</script>

{#snippet menuItem(label: string, href: string, Icon: typeof IconType)}
	<DropdownMenuItem icon={Icon} class="min-w-48" {href}>
		<span>{label}</span>
	</DropdownMenuItem>
{/snippet}

<DropdownMenu
	contentProps={{
		collisionPadding: 20,
		sideOffset: 8
	}}
>
	{#snippet trigger()}
		<Avatar
			class="cursor-pointer border-white"
			src={user?.picture ?? ''}
			alt={user?.username ?? 'User picture'}
		/>
	{/snippet}

	<DropdownMenuItem href="/profile" icon={UserCircleIcon} class="min-w-48">
		<span>Profile</span>
	</DropdownMenuItem>
	<DropdownMenuItem href={`/users/${user?.username}`} icon={LayoutGridIcon} class="min-w-48">
		<span>Submissions</span>
	</DropdownMenuItem>
	<DropdownMenuItem href="/profile#tickets" icon={TicketIcon} class="min-w-48">
		<span>Tickets</span>
	</DropdownMenuItem>

	<DropdownMenuSeparator />
	{#if user.role === 'admin'}
		<DropdownMenuItem href="/admin" icon={ShieldIcon} class="min-w-48">
			<span>Admin</span>
		</DropdownMenuItem>
		<DropdownMenuSeparator />
	{/if}

	<DropdownMenuItem href="/logout" icon={LogOutIcon} class="min-w-48">
		<span>Sign out</span>
	</DropdownMenuItem>
</DropdownMenu>
