<script lang="ts">
	import { Select } from 'bits-ui';
	import {
		Check,
		ChevronsDownIcon,
		ChevronsUpDownIcon,
		ChevronsUpIcon,
		Palette
	} from 'lucide-svelte';

	interface Props {
		items: { value: string; label: string }[];
		label: string;
	}
	// class="h-input rounded-9px border-border-input bg-background placeholder:text-foreground-alt/50 inline-flex w-[296px] select-none items-center border px-[11px] text-sm transition-colors "
	let { items, label }: Props = $props();

	let value = $state<string>('');
	const selectedLabel = $derived(value ? items.find((item) => item.value === value)?.label : label);
</script>

<Select.Root type="single" onValueChange={(v) => (value = v)}>
	<Select.Trigger
		class="flex h-input-md min-w-48 items-center justify-between rounded-full border border-white bg-black px-md py-2 text-white"
		aria-label="Select a item"
	>
		<Palette class="mr-[9px] size-6 text-muted-foreground" />
		{selectedLabel}
		<ChevronsUpDownIcon class="ml-auto size-6 text-muted-foreground" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="focus-override bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border-muted z-50 max-h-96 w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border px-1 py-3 outline-none data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
			sideOffset={10}
		>
			<Select.ScrollUpButton class="flex w-full items-center justify-center">
				<ChevronsUpIcon class="size-3" />
			</Select.ScrollUpButton>
			<Select.Viewport class="p-1">
				{#each items as item, i (i + item.value)}
					<Select.Item
						class="data-[highlighted]:bg-muted flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none duration-75"
						value={item.value}
						label={item.label}
					>
						{#snippet children({ selected })}
							{item.label}
							{#if selected}
								<div class="ml-auto">
									<Check />
								</div>
							{/if}
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
			<Select.ScrollDownButton class="flex w-full items-center justify-center">
				<ChevronsDownIcon class="size-3" />
			</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>

<style lang="postcss">
	/* .trigger {
		@apply flex h-input-md min-w-48 items-center justify-between rounded-full border border-white bg-black px-md py-2 text-white;
	}
	.container {
		@apply z-10 flex flex-col overflow-y-auto rounded-sm bg-white p-1 shadow focus:!ring-0;
	}
	.group {
		@apply py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800;
	}

	.item {
		@apply relative flex h-input-md cursor-pointer items-center rounded-sm px-md text-neutral-800 hover:bg-black hover:text-white focus:z-10 focus:text-zinc-700 data-[highlighted]:bg-black data-[highlighted]:text-white data-[disabled]:opacity-50;
	}
	.check {
		position: absolute;
		left: item(spacing.2);
		top: 50%;
		z-index: item(zIndex.20);
		translate: 0 calc(-50% + 1px);
		color: item(colors.zinc.500);
	} */
</style>
