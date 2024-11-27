<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { PageData } from './$types';
	import FileField from './_components/FileField.svelte';
	import Form from './_components/Form.svelte';
	import TextField from './_components/TextField.svelte';

	let { data }: { data: PageData } = $props();
	console.log('data', data);
</script>

{#if data.form}
	<Form data={data.form} invalidateAll={false} let:message let:superform>
		{#if message}
			<div
				class="status"
				class:error={message.status >= 400}
				class:success={!message.status || message.status < 300}
			>
				{message.text}
			</div>
		{/if}
		<!-- <FileField {superform} field="media" label="Media"></FileField> -->

		<!-- TODO Get or create ticket, select -->
		<TextField type="text" {superform} field="ticketId" label="Ticket"></TextField>

		<TextField type="text" {superform} field="title" label="Title"></TextField>

		<!-- TODO Select, categories for event of selected ticket -->
		<TextField type="text" {superform} field="categoryId" label="Category"></TextField>

		<TextField type="text" {superform} field="mediaId" label="Media"></TextField>

		<!-- TODO File input for thumbnail, generate locally, wasm? -->
		<!-- <TextField type="text" {superform} field="thumbnailId" label="Thumbnail"></TextField> -->

		<!-- TODO Get event from selected ticket -->
		<input type="text" name="eventId" value={data.form?.data.eventId} hidden />
		<input type="text" name="userId" value={data.form?.data.userId} hidden />
		<input type="text" name="status" value={data.form?.data.status} hidden />
		<Button type="submit">Submit</Button>
	</Form>
{/if}
