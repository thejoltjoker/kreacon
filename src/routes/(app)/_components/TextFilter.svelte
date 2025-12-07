<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import { SearchIcon } from 'lucide-svelte';
	import { debounce } from 'throttle-debounce';
	import { cn } from '$lib/utils';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	let value = $state($page.url.searchParams.get('q'));
	let placeholder = 'Search';
	let isLoading = $state(false);

	const handleSearchChange = debounce(500, async (search: string) => {
		isLoading = true;
		const params = new SvelteURLSearchParams($page.url.searchParams);
		if (search != null && search !== '') params.set('q', search);
		else params.delete('q');
		// @ts-expect-error TODO Find correct solution to use resolve() with search params
		await goto(resolve(`?${params.toString()}`), { replaceState: true });
		inputRef?.focus();
		isLoading = false;
	});
	let inputRef: HTMLInputElement | undefined = $state(undefined);
	let isEmpty = $derived(value == null || value === '');

	onMount(() => {
		if (inputRef) inputRef.focus();
	});
</script>

<DumbInput
	type="text"
	bind:elementRef={inputRef}
	icon={SearchIcon}
	iconProps={{
		class: cn(isEmpty ? 'text-shade-300' : 'text-white', isLoading && 'animate-pulse text-primary')
	}}
	{placeholder}
	bind:value
	oninput={(e) => handleSearchChange((e.target as HTMLInputElement).value)}
/>
