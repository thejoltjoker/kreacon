<script lang="ts">
	import { page } from '$app/stores';
	import { DropdownMenu } from 'bits-ui';
	import {
		LayoutGridIcon,
		LogOutIcon,
		TicketIcon,
		UserCircle,
		type Icon as IconType
	} from 'lucide-svelte';
	import Avatar from './Avatar.svelte';

	type MenuItem =
		| {
				label: string;
				href: string;
				icon: typeof IconType;
		  }
		| 'divider';

	const menuItems: MenuItem[] = [
		{
			label: 'Profile',
			href: '/profile',
			icon: UserCircle
		},
		{
			label: 'Submissions',
			href: '/submissions',
			icon: LayoutGridIcon
		},
		{
			label: 'Tickets',
			href: '/tickets',
			icon: TicketIcon
		},
		'divider',
		{
			label: 'Sign out',
			href: '/logout',
			icon: LogOutIcon
		}
	];

	const user = $derived($page.data.user);
</script>

{#snippet menuItem(label: string, href: string, Icon: typeof IconType)}
	<DropdownMenu.Item class="z-50 min-w-48 max-w-full p-2xs">
		<a
			{href}
			class="flex select-none items-center rounded-xs py-xs pl-xs pr-sm text-sm font-medium text-muted-foreground !ring-0 !ring-transparent hover:bg-muted-background hover:text-white"
		>
			<Icon class="text-foreground-alt mr-2 size-5" />
			<span>{label}</span>
		</a>
	</DropdownMenu.Item>
{/snippet}

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar
			class="cursor-pointer border-white"
			src={user?.picture ?? ''}
			alt={user?.username ?? 'User picture'}
		/>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content
		collisionPadding={20}
		class="bg-background shadow-popover w-full max-w-[20rem] rounded-sm border border-muted-foreground bg-black px-1 py-1.5"
		sideOffset={8}
	>
		{#each menuItems as item}
			{#if item === 'divider'}
				<DropdownMenu.Separator class="my-1 -ml-1 -mr-1 block h-px bg-muted-foreground" />
			{:else}
				{@render menuItem(item.label, item.href, item.icon)}
			{/if}
		{/each}

		<!-- <DropdownMenu.Item
			class="flex h-10 select-none items-center rounded-xs py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted-foreground"
		>
			<div class="flex items-center">
				<SettingsIcon class="text-foreground-alt mr-2 size-5" />
				Submissions
			</div>
		</DropdownMenu.Item>
		{@render menuItem('Settings', '/settings', SettingsIcon)}
		<DropdownMenu.Separator class="my-1 -ml-1 -mr-1 block h-px bg-muted-foreground" />
		<DropdownMenu.Item
			class="flex h-10 select-none items-center rounded-xs py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted-foreground"
		>
			<a href="/logout" class="flex items-center">
				<LogOutIcon class="text-foreground-alt mr-2 size-5" />
				Sign out
			</a>
		</DropdownMenu.Item> -->
	</DropdownMenu.Content>
</DropdownMenu.Root>
