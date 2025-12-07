<script lang="ts">
	import { cn } from '$lib/utils';
	import { DropdownMenu, type WithoutChild } from 'bits-ui';
	import { InfoIcon } from 'lucide-svelte';
	import DropdownMenuItem from './DropdownMenuItem.svelte';
	import type { Snippet } from 'svelte';

	interface Props extends DropdownMenu.RootProps {
		contentProps?: WithoutChild<DropdownMenu.ContentProps>;
		trigger?: Snippet;
	}

	let { open = $bindable(false), children, contentProps, trigger, ...props }: Props = $props();
</script>

<DropdownMenu.Root bind:open {...props}>
	<DropdownMenu.Trigger>
		{@render trigger?.()}
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
			<DropdownMenu.Group>
				{@render children?.()}

				{#if children == null}
					<DropdownMenuItem textValue="No items available" class="text-shade-400">
						<InfoIcon class="size-5" />
						No items available
					</DropdownMenuItem>
				{/if}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
