<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Label } from 'bits-ui';
	import type { PageData } from './$types';
	import Form from './_components/Form.svelte';
	import Text from './_components/Text.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import Select from './_components/Select.svelte';

	let { data }: { data: PageData } = $props();
	console.log('data', data);

	const form = superForm(data.form, { resetForm: false });
	const { form: formData } = form;
	let showSuccessAnimation = $state(false);
	let disabled = $state(false);
</script>

<SuperDebug data={$formData} />
{#if data.form}
	<Form {form} bind:showSuccessAnimation bind:disabled>
		<!-- {#if message}
			<div
				class="status"
				class:error={message.status >= 400}
				class:success={!message.status || message.status < 300}
			>
				{message.text}
			</div>
		{/if} -->
		<!-- <FileField {superform} field="media" label="Media"></FileField> -->

		<!-- TODO Get or create ticket, select -->
		<!-- <TextField type="text" {superform} field="ticketId" label="Ticket"></TextField> -->
		<Label.Root>
			<span>Ticket</span>
			<Select
				{form}
				field="ticketId"
				{disabled}
				options={data.events.map((e) => ({ label: e.name ?? 'Unknown', value: e.ticketId }))}
			/>
		</Label.Root>

		<!-- <TextField type="text" {superform} field="title" label="Title"></TextField> -->
		<Label.Root for="title">
			<span>Title</span>
			<Text {form} type="text" field="title" {disabled} />
		</Label.Root>
		<!-- TODO Select, categories for event of selected ticket -->
		<!-- <TextField type="text" {superform} field="categoryId" label="Category"></TextField> -->

		<!-- <TextField type="text" {superform} field="mediaId" label="Media"></TextField> -->

		<!-- TODO File input for thumbnail, generate locally, wasm? -->
		<!-- <TextField type="text" {superform} field="thumbnailId" label="Thumbnail"></TextField> -->

		<!-- TODO Get event from selected ticket -->
		<input type="text" name="eventId" value={data.form?.data.eventId} hidden />
		<input type="text" name="userId" value={data.form?.data.userId} hidden />
		<input type="text" name="status" value={data.form?.data.status} hidden />
		<Button type="submit">Submit</Button>
	</Form>
{/if}
