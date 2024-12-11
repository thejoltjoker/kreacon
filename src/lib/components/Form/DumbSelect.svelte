<script lang="ts">
	import { cn } from '$lib/utils';
	import { Select, type WithoutChildren } from 'bits-ui';
	import { CheckIcon, ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from 'lucide-svelte';

	type Props = WithoutChildren<Select.RootProps> & {
		placeholder?: string;
		items: { value: string; label: string; disabled?: boolean }[];
		contentProps?: WithoutChildren<Select.ContentProps>;
		class?: string;
	};

	let { value = $bindable(), items, contentProps, placeholder, ...props }: Props = $props();

	const selectedLabel = $derived(items.find((item) => item.value === value)?.label);
</script>

<!-- Tried everything to get the type to work 
	 but it's beyond my current knowledge. 
	 Any for now -->
<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<Select.Root bind:value={value as any} {...props}>
	<Select.Trigger
		class={cn(
			'inline-flex h-form items-center justify-between rounded-form border border-shade-600 bg-shade-950 pl-md pr-sm transition hover:border-shade-600/80 hover:bg-shade-900 data-[state=open]:border-violet-500',
			value != null && value !== '' && !Array.isArray(value) && 'border-white hover:border-white',
			props.class
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
				{#if items}
					{#each items as { value, label, disabled } (value)}
						<Select.Item
							{value}
							{label}
							{disabled}
							class="flex cursor-pointer items-center justify-between gap-sm rounded-sm px-md py-sm transition-colors hover:bg-shade-800 data-[highlighted]:bg-shade-800 data-[selected]:bg-shade-700 data-[selected]:hover:bg-shade-800"
						>
							{#snippet children({ selected })}
								{label}
								{#if selected}
									<CheckIcon class="size-5" />
								{/if}
							{/snippet}
						</Select.Item>
					{/each}
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
