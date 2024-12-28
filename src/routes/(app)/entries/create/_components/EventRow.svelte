<script lang="ts">
	import { page } from '$app/stores';
	import SelectField from '$lib/components/Form/SelectField.svelte';
	import type { CreateEntrySchema } from '$lib/schemas/entry';
	import { getContext } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { PageData } from '../$types';

	let { form } = getContext<SuperForm<CreateEntrySchema>>('superform');
</script>

<SelectField
	field="eventId"
	label="Event"
	type="single"
	placeholder="Select an event"
	labelProps={{ class: 'text-2xl font-bold' }}
	items={$page.data.events.map((e: PageData['events'][number]) => ({
		label: e.name ?? 'Unknown',
		value: e.eventId?.toString() ?? ''
	}))}
	onValueChange={() => {
		$form.categoryId = 0;
	}}
/>
