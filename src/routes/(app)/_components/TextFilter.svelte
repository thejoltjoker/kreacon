<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount, type Component } from 'svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import { SearchIcon } from 'lucide-svelte';
	import { debounce } from 'throttle-debounce';
	let value = $state($page.url.searchParams.get('q'));
	let placeholder = 'Search';

	const handleSearchChange = debounce(500, (search: string) => {
		const params = new URLSearchParams($page.url.searchParams);
		if (search != null) params.set('q', search);
		else params.delete('q');
		goto(`?${params.toString()}`);
	});
</script>

{value}
<DumbInput
	icon={SearchIcon}
	{placeholder}
	bind:value
	oninput={(e) => handleSearchChange((e.target as HTMLInputElement).value)}
/>
