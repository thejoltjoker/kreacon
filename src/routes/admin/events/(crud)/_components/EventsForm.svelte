<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import DateField from '$lib/components/Form/DateField.svelte';
	import Form from '$lib/components/Form/GenericForm.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import { createEventSchema, type ZCreateEventSchema } from '$lib/schemas/eventSchema';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import CategoriesSection from './CategoriesSection.svelte';
	import EventRulesSection from './EventRulesSection.svelte';

	let { data, action }: { data: SuperValidated<Infer<ZCreateEventSchema>>; action: string } =
		$props();
	const superform = superForm(data, { validators: zod(createEventSchema), dataType: 'json' });
	const { message } = superform;
</script>

<Form
	debug={false}
	{action}
	{data}
	options={{ validators: zod(createEventSchema), dataType: 'json' }}
	onkeydowncapture={(e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	}}
>
	<TextField type="text" field="name" label="Name" />
	<TextField type="text" field="description" label="Description" />

	<div class="grid grid-cols-2 gap-sm">
		<DateField field="submissionsOpenAt" label="Submissions Open At" />
		<DateField field="submissionsCloseAt" label="Submissions Close At" />
		<DateField field="votingOpenAt" label="Voting Open At" />
		<DateField field="votingCloseAt" label="Voting Close At" />
	</div>
	<Divider />
	<EventRulesSection />
	<Divider />
	<CategoriesSection />
	<Divider />
	<div class="flex justify-center">
		<Button type="submit" class="submit-button">
			{#if action.endsWith('edit')}
				Update Event
			{:else}
				Create Event
			{/if}
		</Button>
	</div>
	{#if $message}
		<p class="message text-center text-red-500">{$message.text}</p>
	{/if}
</Form>
