<script lang="ts">
	import { page } from '$app/stores';
	import GenericForm from '$lib/components/Form/GenericForm.svelte';
	import SelectField from '$lib/components/Form/SelectField.svelte';
	import type { StyledSelectItem } from '$lib/components/Form/StyledSelect.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import type { PageData } from '../$types';
	import CategorySelect from './CategorySelect.svelte';

	let form = $page.data.form;
	let events: PageData['events'] = $state($page.data.events);
	let categories: StyledSelectItem[] = $state([]);

	$effect(() => {
		const event = events?.find((e) => e.eventId?.toString() === form.eventId.toString());
		categories =
			event?.categories?.map((c) => ({
				label: c.name ?? 'Unknown',
				value: c.id.toString(),
				disabled: c.isDisabled ?? false
			})) ?? [];
	});
</script>

<GenericForm debug data={$page.data.form}>
	<TextField field="title" label="Title" labelProps={{ class: 'text-2xl font-bold' }} />
	<SelectField
		field="eventId"
		label="Event"
		type="single"
		placeholder="Select an event"
		labelProps={{ class: 'text-2xl font-bold' }}
		items={$page.data.events.map((e) => ({
			label: e.name ?? 'Unknown',
			value: e.eventId?.toString() ?? ''
		}))}
	/>
	<CategorySelect />
</GenericForm>
