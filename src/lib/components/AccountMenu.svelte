<script lang="ts">
	import type { UserWithoutPassword } from '$lib/server/db/schema/user';
	import Avatar from './Avatar.svelte';
	import { DropdownMenu } from 'bits-ui';
	import { LogOutIcon, SettingsIcon, UserCircle } from 'lucide-svelte';

	let { user }: { user: UserWithoutPassword } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="focus-visible border-border-input bg-background-alt text-foreground focus-visible:ring-foreground focus-visible:ring-offset-background inline-flex h-input-md w-input-md items-end justify-center rounded-full border text-sm font-medium hover:bg-zinc-500 focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-98"
	>
		<Avatar src={user?.picture ?? ''} alt={user?.username ?? 'User picture'} />
	</DropdownMenu.Trigger>
	<div class="p-2">
		<DropdownMenu.Content
			class="bg-background shadow-popover w-full max-w-[20rem] rounded-sm border border-zinc-500 bg-black px-1 py-1.5"
			sideOffset={8}
		>
			<DropdownMenu.Item
				class="flex h-10 select-none items-center rounded-xs py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-zinc-500"
			>
				<a href="/profile" class="flex items-center">
					<UserCircle class="text-foreground-alt mr-2 size-5" />
					Profile
				</a>
			</DropdownMenu.Item>

			<DropdownMenu.Item
				class="flex h-10 select-none items-center rounded-xs py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-zinc-500"
			>
				<div class="flex items-center">
					<SettingsIcon class="text-foreground-alt mr-2 size-5" />
					Submissions
				</div>
			</DropdownMenu.Item>
			<DropdownMenu.Separator class="my-1 -ml-1 -mr-1 block h-px bg-zinc-500" />
			<DropdownMenu.Item
				class="flex h-10 select-none items-center rounded-xs py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-zinc-500"
			>
				<a href="/logout" class="flex items-center">
					<LogOutIcon class="text-foreground-alt mr-2 size-5" />
					Sign out
				</a>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</div>
</DropdownMenu.Root>
