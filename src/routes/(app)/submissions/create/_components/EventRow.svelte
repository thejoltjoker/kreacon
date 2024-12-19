<script lang="ts">
	import { page } from '$app/stores';
	import SelectField from '$lib/components/Form/SelectField.svelte';
	import type { CreateSubmissionSchema } from '$lib/schemas/submission';
	import { getContext } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';

	let { openRows = $bindable() }: { openRows: string[] } = $props();
	let { form } = getContext<SuperForm<CreateSubmissionSchema>>('superform');
</script>

<!-- <SubmissionFormRow title="Event" value="accordion-event"> -->
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
	onValueChange={(value: string | number) => {
		$form.categoryId = 0;
		// const deselected = value == null || value === 0 || value === '';
		// if (deselected) {
		// 	openRows = openRows.filter((row) => row !== 'accordion-category');
		// }
		// else {
		//     if (!openRows.includes('accordion-category')) {
		//         openRows.push('accordion-category');
		//     }
		// }
	}}
/>
<!-- onValueChange={(value: string | number) => {
    const deselected = value == null || value === 0 || value === '';
    if (deselected) {
        openRows = openRows.filter((row) => row !== 'accordion-category');
        $form.categoryId = -1;
    } else {
        if (!openRows.includes('accordion-category')) {
            openRows.push('accordion-category');
        }
    }
}} -->
<!-- </SubmissionFormRow> -->
