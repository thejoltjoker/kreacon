<script lang="ts">
	import { userProvider } from '$lib/providers/userProvider.svelte';

	const user = userProvider.user;

	import Avatar from './Avatar.svelte';

	import { DropdownMenu } from 'bits-ui';
	import { LogOutIcon, SettingsIcon, UserCircle } from 'lucide-svelte';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="focus-visible inline-flex h-input-md w-input-md items-end justify-center rounded-full border border-border-input bg-background-alt text-sm font-medium text-foreground hover:bg-zinc-500 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
	>
		<Avatar src={user?.picture ?? ''} />
	</DropdownMenu.Trigger>
	<div class="p-2">
		<DropdownMenu.Content
			class="w-full max-w-[20rem] rounded-sm border border-zinc-500 bg-background px-1 py-1.5 shadow-popover bg-black"
			sideOffset={8}
		>
			<DropdownMenu.Item
				class="rounded-xs flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-zinc-500"
			>
				<div class="flex items-center">
					<UserCircle class="mr-2 size-5 text-foreground-alt" />
					Profile
				</div>
			</DropdownMenu.Item>

			<DropdownMenu.Item
				class="rounded-xs flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-zinc-500"
			>
				<div class="flex items-center">
					<SettingsIcon class="mr-2 size-5 text-foreground-alt" />
					Settings
				</div>
			</DropdownMenu.Item>
			<DropdownMenu.Separator class="my-1 -ml-1 -mr-1 block h-px bg-zinc-500" />
			<DropdownMenu.Item
				class="rounded-xs flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-zinc-500"
			>
				<div class="flex items-center">
					<LogOutIcon class="mr-2 size-5 text-foreground-alt" />
					Sign out
				</div>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</div>
</DropdownMenu.Root>
