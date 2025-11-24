<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { Combobox } from 'bits-ui';
	import { ChevronsUpDownIcon, DotIcon, XCircleIcon } from 'lucide-svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

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
		const params = new SvelteURLSearchParams($page.url.searchParams);
		if (event) params.set('event', event);
		else params.delete('event');
		goto(resolve(`?${params.toString()}`), { replaceState: true });
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
		<div class="input pl-md data-active:font-bold" data-active={isActive}>
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
				class="right-form text-shade-300 absolute top-1/2 hidden -translate-y-1/2"
				onclick={handleClear}
				aria-label="Clear event filter"
			>
				<XCircleIcon />
			</button>
		</div>
		<Combobox.Portal>
			<Combobox.Content
				{customAnchor}
				class="rounded-form border-muted-background bg-muted-background p-xs z-30 w-(--bits-combobox-anchor-width) border"
				sideOffset={10}
			>
				{#if filteredItems.length > 0}
					{#each filteredItems as item (item.value)}
						<Combobox.Item value={item.value} label={item.label} class="combobox-item group">
							{item.label}
							<span
								class="text-primary hidden items-center justify-center group-data-selected:flex"
							>
								<DotIcon class="h-form w-form" />
							</span>
						</Combobox.Item>
					{/each}
				{:else}
					<span class="p-xs text-shade-300">No results found</span>
				{/if}
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
</div>
