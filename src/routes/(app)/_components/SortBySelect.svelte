<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { Select } from 'bits-ui';
	import { ArrowDownUpIcon, DotIcon } from 'lucide-svelte';

	type Props = {
		items: { value: string; label: string; disabled?: boolean }[];
	};

	let { items }: Props = $props();

	let value = $state($page.url.searchParams.get('sortBy') || 'newest');
	let placeholder = 'Sort by';

	const selectedLabel = $derived(items.find((item) => item.value === value)?.label);

	const handleSortByChange = (sortBy: string) => {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('sortBy', sortBy);
		value = sortBy;
		goto(`?${params.toString()}`);
	};
</script>

<Select.Root type="single" {value} onValueChange={handleSortByChange} allowDeselect={false}>
	<Select.Trigger
		class="select-trigger sort-by-select flex gap-sm text-nowrap border-white font-bold"
	>
		<p>{$t('Sorted by')}{': '}<span>{selectedLabel ?? placeholder}</span></p>

		<ArrowDownUpIcon class="size-5" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content class="select-content">
			<Select.Viewport>
				{#each items as { value, label, disabled } (value)}
					<Select.Item {value} {label} {disabled} class="select-item">
						<span>
							{label}
						</span>
						<span
							class="hidden items-center justify-center text-primary group-data-[selected]:flex"
						>
							<DotIcon class="h-form w-form" />
						</span>
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
