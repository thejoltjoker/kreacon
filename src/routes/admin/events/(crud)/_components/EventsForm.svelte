<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DateField from '$lib/components/Form/DateField.svelte';
	import Form from '$lib/components/Form/GenericForm.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	import { createEventSchema, type ZCreateEventSchema } from '$lib/schemas/eventSchema';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	let { data }: { data: SuperValidated<Infer<ZCreateEventSchema>> } = $props();
	const superform = superForm(data, { validators: zod(createEventSchema) });
	const { message } = superform;
</script>

<Form
	debug={true}
	action="/admin/events/create"
	{data}
	options={{ validators: zod(createEventSchema) }}
>
	<TextField {superform} type="text" field="name" label="Name" />
	<TextField {superform} type="text" field="description" label="Description" />

	<DateField field="submissionsOpenAt" label="Submissions Open At" />
	<TextField {superform} type="date" field="submissionsCloseAt" label="Submissions Close At" />
	<TextField {superform} type="date" field="votingOpenAt" label="Voting Open At" />
	<TextField {superform} type="date" field="votingCloseAt" label="Voting Close At" />
	<div class="flex justify-center">
		<Button type="submit" class="submit-button">Create event</Button>
	</div>
	{#if $message}
		<p class="message text-center text-red-500">{$message.text}</p>
	{/if}
</Form>
