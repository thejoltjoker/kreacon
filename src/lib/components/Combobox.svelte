<script lang="ts">
	import { cn } from '$lib/utils';
	import { Combobox, type WithoutChildrenOrChild, mergeProps } from 'bits-ui';
	import { ChevronsUpDownIcon, DotIcon } from 'lucide-svelte';
	// TODO Clear combobox button
	type Item = { value: string; label: string };

	type Props = Combobox.RootProps & {
		items: Item[];
		inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
		contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
	};

	let {
		items,
		value = $bindable(),
		open = $bindable(false),
		inputProps,
		contentProps,
		...restProps
	}: Props = $props();

	let searchValue = $state('');

	const filteredItems = $derived.by(() => {
		if (searchValue === '') return items;
		return items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()));
	});

	const handleInput = (e: Event & { currentTarget: HTMLInputElement }) => {
		searchValue = e.currentTarget.value;
	};

	function handleOpenChange(newOpen: boolean) {
		if (!newOpen) searchValue = '';
	}

	const mergedRootProps = $derived(mergeProps(restProps, { onOpenChange: handleOpenChange }));
	const mergedInputProps = $derived(mergeProps(inputProps, { oninput: handleInput }));

	const contentClassName = cn(
		'w-(--bits-combobox-anchor-width) rounded-form border border-muted-background bg-muted-background p-xs',
		contentProps?.class
	);
	let active = $derived(value != '' ? true : null);
</script>

<div class="combobox relative">
	<!-- eslint-disable @typescript-eslint/no-explicit-any -->
	<Combobox.Root bind:value={value as any} bind:open {...mergedRootProps as Combobox.RootProps}>
		<Combobox.Input {...mergedInputProps} class="input" data-active={active} />
		<Combobox.Trigger aria-label="Select an item" class="combobox-trigger">
			<ChevronsUpDownIcon />
		</Combobox.Trigger>
		<Combobox.Portal>
			<Combobox.Content {...contentProps} class={contentClassName} sideOffset={10}>
				{#each filteredItems as item, i (i + item.value)}
					<Combobox.Item value={item.value} label={item.label} class="combobox-item group">
						{#snippet children()}
							{item.label}
							<span
								class="hidden items-center justify-center text-primary group-data-selected:flex"
							>
								<DotIcon class="h-form w-form" />
							</span>
						{/snippet}
					</Combobox.Item>
				{:else}
					<span> No results found </span>
				{/each}
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
</div>
