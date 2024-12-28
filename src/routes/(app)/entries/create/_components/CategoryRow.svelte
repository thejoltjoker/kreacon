<script lang="ts">
	import { page } from '$app/stores';
	import SelectField from '$lib/components/Form/SelectField.svelte';
	import type { CreateEntrySchema } from '$lib/schemas/entry';
	import { getContext } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { type PageData } from '../$types';

	let events: PageData['events'] = $state($page.data.events);
	let categories = $derived(
		events
			?.find((e) => e.eventId?.toString() === $form.eventId.toString())
			?.categories?.map((c) => ({
				label: c.name ?? 'Unknown',
				value: c.id.toString(),
				disabled: c.isDisabled ?? false
			})) ?? []
	);
	let { form } = getContext<SuperForm<CreateEntrySchema>>('superform');
</script>

<SelectField
	field="categoryId"
	label="Category"
	type="single"
	placeholder="Select a category"
	labelProps={{ class: 'text-2xl font-bold' }}
	items={categories}
/>
