<script lang="ts">
	import { cn } from '$lib/utils';
	import {
		Combobox,
		type SelectSingleRootProps,
		type WithoutChildrenOrChild,
		mergeProps
	} from 'bits-ui';
	import { ChevronsUpDownIcon, DotIcon, XCircleIcon } from 'lucide-svelte';
	// TODO Clear combobox button
	type Item = { value: string; label: string };

	type Props = Omit<SelectSingleRootProps, 'type'> & {
		resetValue?: () => void;
		items: Item[];
		inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
		contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
	};
	let customAnchor = $state<HTMLElement>();
	let inputRef = $state<HTMLInputElement | null>(null);
	let {
		items,
		value = $bindable(),
		open = $bindable(false),
		inputProps,
		contentProps,
		resetValue,
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

	const contentClassName = cn(
		'w-[var(--bits-combobox-anchor-width)] rounded-form border border-muted-background bg-muted-background p-xs',
		contentProps?.class
	);
	let active = $derived(value != '' || value != null ? true : null);
	$effect(() => {
		console.log(active);
		console.log(value);
	});
</script>

<div class="combobox relative" bind:this={customAnchor}>
	<!-- eslint-disable @typescript-eslint/no-explicit-any -->
	<Combobox.Root
		type="single"
		bind:value={value as any}
		bind:open
		{...restProps}
		onOpenChange={handleOpenChange}
	>
		<div class="input pl-sm data-[active]:font-bold" data-active={active}>
			<p>Event:</p>
			<Combobox.Input
				{...inputProps}
				bind:ref={inputRef}
				oninput={handleInput}
				class="w-full border-none bg-transparent outline-none ring-0 focus:ring-transparent"
				data-active={active}
				placeholder="Filter by event"
			/>
			<Combobox.Trigger aria-label="Filter by event" class="combobox-trigger">
				<ChevronsUpDownIcon />
			</Combobox.Trigger>
			<button
				class="absolute right-form top-1/2 -translate-y-1/2 text-muted-foreground"
				onclick={() => {
					resetValue?.();
					searchValue = '';
					if (inputRef != null) inputRef.value = '';
				}}
			>
				<XCircleIcon />
			</button>
		</div>
		<Combobox.Portal>
			<Combobox.Content {customAnchor} {...contentProps} class={contentClassName} sideOffset={10}>
				{#each filteredItems as item, i (i + item.value)}
					<Combobox.Item value={item.value} label={item.label} class="combobox-item group">
						{#snippet children()}
							{item.label}
							<span
								class="hidden items-center justify-center text-primary group-data-[selected]:flex"
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
