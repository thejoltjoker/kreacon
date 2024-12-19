<script lang="ts" module>
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
		...props
	}: StyledSelectProps = $props();

	const selectedLabel = $derived(items.find((item) => item.value === value)?.label);
</script>

{#snippet item(value: string, label: string, disabled: boolean | undefined)}
	<Select.Item
		{value}
		{label}
		{disabled}
		class="flex cursor-pointer items-center justify-between gap-sm rounded-sm px-md py-sm transition-colors hover:bg-shade-800 data-[disabled]:!cursor-default data-[disabled]:!bg-transparent data-[highlighted]:bg-shade-800 data-[selected]:bg-shade-700 data-[selected]:font-bold data-[disabled]:text-shade-300 data-[selected]:hover:bg-shade-800"
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
			'inline-flex h-form w-full items-center justify-between rounded-form border border-shade-600 bg-shade-950 pl-md pr-sm transition hover:border-shade-600/80 hover:bg-shade-900 data-[state=open]:border-violet-500',
			value != null &&
				value !== '' &&
				String(value) !== '0' &&
				!Array.isArray(value) &&
				'border-white hover:border-white',
			className
		)}
	>
		{selectedLabel ?? placeholder}
		<ChevronsUpDownIcon class="size-5" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			sideOffset={12}
			{...contentProps}
			class={cn(
				'z-40 flex max-h-[80vh] w-[var(--bits-select-anchor-width)] flex-col rounded-form border border-shade-600 bg-shade-900 p-xs',
				contentProps?.class
			)}
		>
			<Select.ScrollUpButton
				class="z-50 flex items-center justify-center rounded-full py-2xs hover:bg-shade-800 focus-visible:bg-shade-800"
			>
				<ChevronUpIcon class="size-4" />
			</Select.ScrollUpButton>
			<Select.Viewport>
				{#each items as { value, label, disabled } (value)}
					{@render item(value, label, disabled)}
				{/each}

				{#if items.length == 0}
					<Select.Item value="" class="cursor-pointer rounded-form p-sm hover:bg-muted-background">
						No items found
					</Select.Item>
				{/if}
			</Select.Viewport>
			<Select.ScrollDownButton
				class="z-50 flex items-center justify-center rounded-full py-2xs hover:bg-shade-800 focus-visible:bg-shade-800"
			>
				<ChevronDownIcon class="size-4" />
			</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
