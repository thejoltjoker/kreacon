<!-- TODO Replace `any` with generic? -->
<script lang="ts" module>
	export interface EntityListActionItem extends DropdownMenuItemProps {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		label: string | ((item: any) => string);
		icon: typeof IconType;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onClick: (item: any) => void;
	}
	type Props = DropdownMenu.RootProps & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		item: any;
		actions: EntityListActionItem[];
		contentProps?: WithoutChild<DropdownMenu.ContentProps>;
		class?: string;
	};
</script>

<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { cn } from '$lib/utils';
	import { DropdownMenu, type DropdownMenuItemProps, type WithoutChild } from 'bits-ui';
	import type { Icon as IconType } from 'lucide-svelte';
	import { EllipsisIcon, InfoIcon } from 'lucide-svelte';

	let { open = $bindable(false), actions, contentProps, item, ...props }: Props = $props();
</script>

<DropdownMenu.Root bind:open {...props}>
	<DropdownMenu.Trigger>
		<Button variant="outline" size="icon">
			<EllipsisIcon />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			sideOffset={12}
			{...contentProps}
			class={cn(
				'rounded-form border-shade-600 bg-shade-900 p-xs z-40 flex max-h-[80vh] w-(--bits-dropdown-anchor-width) min-w-[200px] flex-col border',
				contentProps?.class
			)}
		>
			<DropdownMenu.Group aria-label="Actions">
				{#each actions as { icon: Icon, label, onClick, ...actionItem }, i (i)}
					{@const labelText = typeof label === 'function' ? label(item) : label}
					<DropdownMenu.Item
						{...actionItem}
						textValue={labelText}
						class={cn(
							'gap-sm px-md py-sm hover:bg-shade-800 data-highlighted:bg-shade-800 flex cursor-pointer items-center justify-start rounded-sm transition-colors',
							actionItem.class
						)}
						onclick={() => onClick(item)}
					>
						<Icon class="size-5" />
						{labelText}
					</DropdownMenu.Item>
				{/each}
				{#if actions.length === 0}
					<DropdownMenu.Item
						textValue="No actions available"
						class="gap-sm px-md py-sm text-shade-400  flex items-center justify-start"
					>
						<InfoIcon class="size-5" />
						No actions available
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
