<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Combobox } from 'bits-ui';
	import { ChevronsUpDownIcon, DotIcon, XCircleIcon } from 'lucide-svelte';

	type Item = { value: string; label: string };
	type Props = {
		items: Item[];
	};
	let { items }: Props = $props();

	let customAnchor = $state<HTMLElement>();
	let inputRef = $state<HTMLInputElement | null>(null);
	let value = $state($page.url.searchParams.get('event') ?? '');
	let searchValue = $state('');
	let isActive = $derived(value === '' || value === null ? undefined : true);

	const filteredItems = $derived.by(() => {
		if (searchValue === '') return items;
		return items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()));
	});

	const handleValueChange = (event: string | undefined) => {
		const params = new URLSearchParams($page.url.searchParams);
		if (event) params.set('event', event);
		else params.delete('event');
		goto(`?${params.toString()}`);
	};

	const handleInput = (e: Event & { currentTarget: HTMLInputElement }) => {
		searchValue = e.currentTarget.value;
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) searchValue = '';
	};

	const handleClear = () => {
		value = '';
		searchValue = '';
		if (inputRef) inputRef.value = '';
		handleValueChange(undefined);
	};
</script>

<div class="combobox relative" bind:this={customAnchor}>
	<Combobox.Root
		type="single"
		bind:value
		onOpenChange={handleOpenChange}
		onValueChange={handleValueChange}
	>
		<div class="input pl-md data-[active]:font-bold" data-active={isActive}>
			<p class="font-bold">Event:</p>
			<Combobox.Input
				bind:ref={inputRef}
				oninput={handleInput}
				defaultValue={items?.find((e) => e.value === value)?.label ?? ''}
				class="w-full border-none bg-transparent outline-none focus:ring-transparent"
				placeholder="Filter by event"
			/>
			<Combobox.Trigger aria-label="Filter by event" class="combobox-trigger">
				<ChevronsUpDownIcon />
			</Combobox.Trigger>
			<button
				class:hidden={!isActive}
				class="absolute right-form top-1/2 hidden -translate-y-1/2 text-shade-300"
				onclick={handleClear}
				aria-label="Clear event filter"
			>
				<XCircleIcon />
			</button>
		</div>
		<Combobox.Portal>
			<Combobox.Content
				{customAnchor}
				class="z-30 w-[var(--bits-combobox-anchor-width)] rounded-form border border-muted-background bg-muted-background p-xs"
				sideOffset={10}
			>
				{#if filteredItems.length > 0}
					{#each filteredItems as item}
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
					{/each}
				{:else}
					<span class="p-xs text-shade-300">No results found</span>
				{/if}
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
</div>
