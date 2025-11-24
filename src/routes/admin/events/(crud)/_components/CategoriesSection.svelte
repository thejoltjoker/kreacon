<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { ZCreateEventSchema } from '$lib/schemas/eventSchema';
	import { PlusIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { type Infer, type SuperForm } from 'sveltekit-superforms/client';
	import CategoryInput from './CategoryInput.svelte';

	interface CategoriesSectionProps {
		/**
		 * Optional SuperForm instance. If not provided, will attempt to get from GenericForm context
		 * Must be provided if used outside of GenericForm
		 * @default undefined
		 */
		superform?: SuperForm<Infer<ZCreateEventSchema>>;
	}

	let { superform }: CategoriesSectionProps = $props();

	if (superform == null) {
		superform = getContext<SuperForm<Infer<ZCreateEventSchema>>>('superform');
		if (superform == null) {
			throw new Error('Failed to load form context');
		}
	}

	const { form } = superform;
</script>

<div class="flex items-center justify-between">
	<h3>Categories</h3>
	<Button
		icon={PlusIcon}
		variant="outline"
		onclick={() => ($form.categories = [...$form.categories, { categoryId: 0, rules: [] }])}
	>
		Add Category
	</Button>
</div>
{#each $form.categories as _, index (index)}
	<CategoryInput
		category={$form.categories[index]}
		setCategory={(data) => ($form.categories[index] = data)}
	/>
{/each}
