<script lang="ts">
	import { page } from '$app/stores';
	import {
		LayoutGridIcon,
		LogOutIcon,
		ShieldIcon,
		TicketIcon,
		UserCircleIcon
	} from 'lucide-svelte';
	import Avatar from './Avatar.svelte';
	import DropdownMenuItem from './DropdownMenuItem.svelte';
	import DropdownMenu from './DropdownMenu.svelte';
	import DropdownMenuSeparator from './DropdownMenuSeparator.svelte';
	import { t } from '$lib/i18n';

	const user = $derived($page.data.user);
</script>

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
			username={user?.username}
		/>
	{/snippet}

	<DropdownMenuItem href="/profile" icon={UserCircleIcon} class="min-w-48">
		<span>{$t('Profile')}</span>
	</DropdownMenuItem>
	<DropdownMenuItem href={`/users/${user?.username}`} icon={LayoutGridIcon} class="min-w-48">
		<span>{$t('Entries')}</span>
	</DropdownMenuItem>
	<DropdownMenuItem href="/profile#tickets" icon={TicketIcon} class="min-w-48">
		<span>{$t('Tickets')}</span>
	</DropdownMenuItem>

	<DropdownMenuSeparator />
	{#if user.role === 'admin'}
		<DropdownMenuItem href="/admin" icon={ShieldIcon} class="min-w-48">
			<span>{$t('Admin')}</span>
		</DropdownMenuItem>
		<DropdownMenuSeparator />
	{/if}

	<DropdownMenuItem href="/logout" icon={LogOutIcon} class="min-w-48">
		<span>{$t('Sign out')}</span>
	</DropdownMenuItem>
</DropdownMenu>
