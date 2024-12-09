<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import DumbSelect from '$lib/components/Form/DumbSelect.svelte';
	import { LockIcon, PlusIcon, UnlockIcon } from 'lucide-svelte';
	import type { PageData } from '../$types';

	interface Props {
		categories: PageData['categories'];
		title: string;
		value: number;
		rules: { value: string; isLocked: boolean }[];
	}

	let { categories, title, value = $bindable(), rules = $bindable() }: Props = $props();

	let categoriesItems = $derived(
		categories.map((category) => ({
			value: category.id.toString(),
			label: category.name
		}))
	);

	let selectedCategory = $state('');
	$effect(() => {
		value = Number(selectedCategory);
	});
</script>

<div class="flex w-full flex-col gap-sm rounded-form border border-divider p-xl">
	<h4>Category: {title}</h4>
	<!-- TODO Replace with select/combobox -->
	<!-- <DumbInput name="categories" bind:value class="w-full" /> -->
	<DumbSelect
		name="categories"
		type="single"
		items={categoriesItems}
		bind:value={selectedCategory}
		placeholder="Select a category"
	/>

	<div class="mt-sm flex items-center justify-between">
		<h5>Rules</h5>
		<Button
			icon={PlusIcon}
			variant="neutral"
			class="rounded-none border-b border-transparent text-muted-foreground-alt hover:border-white hover:text-white"
			onclick={() => rules.push({ value: '', isLocked: false })}
		>
			Add Rule
		</Button>
	</div>
	<ul class="flex flex-col gap-sm">
		{#each rules as _, index}
			<li class="flex items-center gap-sm">
				<DumbInput
					onkeydowncapture={(e: KeyboardEvent) => {
						if (e.key === 'Enter') {
							rules[index].isLocked = !rules[index].isLocked;
						}
					}}
					bind:value={rules[index].value}
					disabled={rules[index].isLocked}
					icon={rules[index].isLocked ? LockIcon : UnlockIcon}
					iconProps={{
						onclick: () => (rules[index].isLocked = !rules[index].isLocked),
						class:
							'cursor-pointer text-white p-xs -mr-xs rounded-xs w-3xl h-3xl hover:bg-muted-background transition-colors'
					}}
				/>
			</li>
		{/each}
	</ul>
</div>
