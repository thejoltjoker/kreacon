<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import { SearchIcon } from 'lucide-svelte';
	import { debounce } from 'throttle-debounce';
	import { cn } from '$lib/utils';
	let value = $state($page.url.searchParams.get('q'));
	let placeholder = 'Search';
	let isLoading = $state(false);

	const handleSearchChange = debounce(500, async (search: string) => {
		isLoading = true;
		const params = new URLSearchParams($page.url.searchParams);
		if (search != null && search !== '') params.set('q', search);
		else params.delete('q');
		await goto(`?${params.toString()}`);
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
