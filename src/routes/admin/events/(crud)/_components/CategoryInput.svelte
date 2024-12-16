<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import DumbSelect from '$lib/components/Form/DumbSelect.svelte';
	import { PencilIcon, PlusIcon, UnlockIcon } from 'lucide-svelte';
	import type { PageData } from '../create2/$types';
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	interface Category {
		categoryId: number;
		rules: { text: string; isLocked: boolean }[];
	}
	interface Props {
		category: Category;
		setCategory: (category: Category) => void;
	}

	let { category, setCategory }: Props = $props();
	let { categories } = $page.data as PageData;

	let categoriesItems = $derived(
		categories.map((category) => ({
			value: category.id.toString(),
			label: category.name
		}))
	);

	let rulesContainerRef: HTMLUListElement | undefined = $state(undefined);

	let selectedCategory = $state(category.categoryId.toString() ?? '');

	let title = $derived(categories.find((cat) => cat.id === category.categoryId)?.name);

	const handleAddRule = async (value: string) => {
		setCategory({ ...category, rules: [...category.rules, { text: value, isLocked: false }] });

		tick().then(() => {
			const inputs = rulesContainerRef?.querySelectorAll('.category-rule');
			if (inputs?.length) {
				(inputs[inputs.length - 1] as HTMLInputElement).focus();
			}
		});
	};

	const handleEditRule = (value: string, index: number) => {
		setCategory({
			...category,
			rules: category.rules.map((rule, i) => (i === index ? { ...rule, text: value } : rule))
		});
	};

	const handleToggleRuleIsLocked = (index: number) => {
		setCategory({
			...category,
			rules: category.rules.map((rule, i) =>
				i === index ? { ...rule, isLocked: !rule.isLocked } : rule
			)
		});
	};
</script>

<div class="flex w-full flex-col gap-sm rounded-form border border-divider p-xl">
	<h4>Category: {title ?? 'Unknown'}</h4>
	<DumbSelect
		onValueChange={(value) => {
			setCategory({ ...category, categoryId: parseInt(value) });
		}}
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
			onclick={() => handleAddRule('')}
		>
			Add Rule
		</Button>
	</div>
	<ul class="flex flex-col gap-sm" bind:this={rulesContainerRef}>
		{#each category.rules as _, index}
			<li class="flex items-center gap-sm">
				<DumbInput
					value={category.rules[index].text}
					type="text"
					onkeydowncapture={(e: KeyboardEvent) => {
						if (e.key === 'Enter') {
							handleToggleRuleIsLocked(index);
							handleAddRule('');
						}
					}}
					oninput={(e) => {
						handleEditRule(e.currentTarget.value, index);
					}}
					class="category-rule"
					disabled={category.rules[index].isLocked}
					icon={category.rules[index].isLocked ? PencilIcon : UnlockIcon}
					iconProps={{
						onclick: () => handleToggleRuleIsLocked(index),
						class:
							'cursor-pointer text-white p-xs -mr-xs rounded-xs w-3xl h-3xl hover:bg-muted-background transition-colors'
					}}
				/>
			</li>
		{/each}
	</ul>
</div>
