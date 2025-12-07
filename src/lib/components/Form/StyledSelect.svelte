<script lang="ts" module>
	import { Icon as IconType } from 'lucide-svelte';
	export type StyledSelectItem = {
		value: string;
		label: string;
		disabled?: boolean;
	};
	export type StyledSelectProps = {
		placeholder?: string;
		items: StyledSelectItem[];
		contentProps?: WithoutChildren<Select.ContentProps>;
		class?: string;
		triggerIcon?: typeof IconType;
		customLabel?: string;
	} & (
		| ({ type: 'single' } & SelectSingleRootProps)
		| ({ type: 'multiple' } & SelectMultipleRootProps)
	);
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronsUpDownIcon, ChevronUpIcon, ChevronDownIcon, CheckIcon } from 'lucide-svelte';
	import {
		Select,
		type SelectMultipleRootProps,
		type SelectSingleRootProps,
		type WithoutChildren
	} from 'bits-ui';

	let {
		value = $bindable(),
		items,
		contentProps,
		placeholder = 'Select an item',
		class: className,
		triggerIcon: TriggerIcon = ChevronsUpDownIcon,
		customLabel,
		...props
	}: StyledSelectProps = $props();

	const selectedLabel = $derived(items.find((item) => item.value === value)?.label);
</script>

{#snippet item(value: string, label: string, disabled: boolean | undefined)}
	<Select.Item
		{value}
		{label}
		{disabled}
		class="gap-sm px-md py-sm hover:bg-shade-800 data-highlighted:bg-shade-800 data-selected:bg-shade-700 data-disabled:text-shade-300 data-selected:hover:bg-shade-800 flex cursor-pointer items-center justify-between rounded-sm transition-colors data-disabled:cursor-default! data-disabled:bg-transparent! data-selected:font-bold"
	>
		{#snippet children({ selected })}
			{label}
			{#if selected}
				<CheckIcon class="size-5" />
			{/if}
		{/snippet}
	</Select.Item>
{/snippet}

<!-- Tried everything to get the type to work 
	 but it's beyond my current knowledge. 
	 Any for now -->
<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<Select.Root bind:value={value as any} {...props}>
	<Select.Trigger
		class={cn(
			'h-form gap-xs rounded-form border-shade-600 bg-shade-950 pl-md pr-sm text-shade-300 hover:border-shade-600/80 hover:bg-shade-900 inline-flex w-full items-center justify-between border text-nowrap transition data-[state=open]:border-violet-500',
			value != null &&
				value !== '' &&
				String(value) !== '0' &&
				!Array.isArray(value) &&
				'border-white text-white hover:border-white',
			className
		)}
	>
		{customLabel ?? selectedLabel ?? placeholder}
		<TriggerIcon class="size-5" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			sideOffset={12}
			{...contentProps}
			class={cn(
				'rounded-form border-shade-600 bg-shade-900 p-xs z-40 flex max-h-[80vh] w-(--bits-select-anchor-width) flex-col border',
				contentProps?.class
			)}
		>
			<Select.ScrollUpButton
				class="py-2xs hover:bg-shade-800 focus-visible:bg-shade-800 z-50 flex items-center justify-center rounded-full"
			>
				<ChevronUpIcon class="size-4" />
			</Select.ScrollUpButton>
			<Select.Viewport>
				{#each items as { value, label, disabled } (value)}
					{@render item(value, label, disabled)}
				{/each}

				{#if items.length == 0}
					<Select.Item value="" class="rounded-form p-sm hover:bg-muted-background cursor-pointer">
						No items found
					</Select.Item>
				{/if}
			</Select.Viewport>
			<Select.ScrollDownButton
				class="py-2xs hover:bg-shade-800 focus-visible:bg-shade-800 z-50 flex items-center justify-center rounded-full"
			>
				<ChevronDownIcon class="size-4" />
			</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
