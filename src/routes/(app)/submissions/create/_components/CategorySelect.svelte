<script lang="ts">
	import { page } from '$app/stores';
	import SelectField from '$lib/components/Form/SelectField.svelte';
	import type { StyledSelectItem } from '$lib/components/Form/StyledSelect.svelte';
	import type { CreateSubmissionSchema } from '$lib/schemas/submission';
	import { getContext } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { type PageData } from '../$types';

	let events: PageData['events'] = $state($page.data.events);
	let categories: StyledSelectItem[] = $state([]);
	let { form } = getContext<SuperForm<CreateSubmissionSchema>>('superform');

	$effect(() => {
		console.log($form);
		const event = events?.find((e) => e.eventId?.toString() === $form.eventId.toString());
		categories =
			event?.categories?.map((c) => ({
				label: c.name ?? 'Unknown',
				value: c.id.toString(),
				disabled: c.isDisabled ?? false
			})) ?? [];
	});
</script>

<SelectField
	field="category"
	label="Category"
	type="single"
	placeholder="Select a category"
	labelProps={{ class: 'text-2xl font-bold' }}
	items={categories}
/>
