<script lang="ts">
	import { Select, type SelectSingleRootProps, type WithoutChildren } from 'bits-ui';
	import { ChevronsUpDownIcon, DotIcon } from 'lucide-svelte';

	type Props = Omit<WithoutChildren<SelectSingleRootProps>, 'type'> & {
		placeholder?: string;
		items: { value: string; label: string; disabled?: boolean }[];
		contentProps?: WithoutChildren<Select.ContentProps>;
	};

	let { value = $bindable(''), items, contentProps, placeholder, ...restProps }: Props = $props();

	const selectedLabel = $derived(items.find((item) => item.value === value)?.label);
</script>

<Select.Root type="single" bind:value {...restProps}>
	<Select.Trigger class="select-trigger">
		<span>{selectedLabel ?? placeholder}</span>
		<ChevronsUpDownIcon class="size-5" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content {...contentProps} class="select-content">
			<Select.Viewport>
				{#each items as { value, label, disabled } (value)}
					<Select.Item {value} {label} {disabled} class="select-item">
						<span>
							{label}
						</span>
						<span
							class="hidden items-center justify-center text-primary group-data-selected:flex"
						>
							<DotIcon class="h-form w-form" />
						</span>
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
