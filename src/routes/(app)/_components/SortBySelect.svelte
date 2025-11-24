<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import StyledSelect from '$lib/components/Form/StyledSelect.svelte';
	import { t } from '$lib/i18n';
	import { ArrowDownUpIcon } from 'lucide-svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	type Props = {
		items: { value: string; label: string; disabled?: boolean }[];
	};

	let { items }: Props = $props();

	let value = $state($page.url.searchParams.get('sortBy') || 'newest');
	let placeholder = 'Sort by';

	const selectedLabel = $derived(items.find((item) => item.value === value)?.label);

	const handleSortByChange = (sortBy: string) => {
		const params = new SvelteURLSearchParams($page.url.searchParams);
		params.set('sortBy', sortBy);
		value = sortBy;
		goto(resolve(`?${params.toString()}`), { replaceState: true });
	};
</script>

<StyledSelect
	onValueChange={handleSortByChange}
	allowDeselect={false}
	{items}
	{placeholder}
	type="single"
	bind:value
	id="sort-by"
	name="sort-by"
	triggerIcon={ArrowDownUpIcon}
	customLabel={`${$t('Sorted by')}: ${selectedLabel ?? placeholder}`}
	class="font-bold"
/>
