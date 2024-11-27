<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Label } from 'bits-ui';
	import type { PageData } from './$types';
	import Form from './_components/Form.svelte';
	import Text from './_components/Text.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import Select from './_components/Select.svelte';
	import type { SelectItem } from './_types/SelectItem';

	let { data }: { data: PageData } = $props();
	console.log('data', data);

	const form = superForm(data.form, { resetForm: false });
	const formData = form.form;
	let showSuccessAnimation = $state(false);
	let disabled = $state(false);
	let categories: SelectItem[] = $state([]);

	$effect(() => {
		const event = data.events?.find((e) => e.eventId?.toString() === $formData.eventId.toString());
		categories =
			event?.categories?.map((c) => ({ label: c.name ?? 'Unknown', value: c.id.toString() })) ?? [];
	});
</script>

<div class="mx-auto max-w-screen-md">
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
				<span>Event</span>
				<Select
					{form}
					label="Select an event"
					field="eventId"
					{disabled}
					items={data.events.map((e) => ({
						label: e.name ?? 'Unknown',
						value: e.eventId?.toString() ?? ''
					}))}
				/>
			</Label.Root>

			<Label.Root>
				<span>Category</span>
				<Select
					{form}
					label="Select a category"
					field="categoryId"
					disabled={disabled || $formData.eventId == null}
					items={categories}
				/>
			</Label.Root>

			<!-- <TextField type="text" {superform} field="title" label="Title"></TextField> -->
			<Label.Root for="title">
				<span>Title</span>
				<Text {form} type="text" field="title" {disabled} />
			</Label.Root>

			<!-- <TextField type="text" {superform} field="mediaId" label="Media"></TextField> -->

			<!-- TODO File input for thumbnail, generate locally, wasm? -->
			<!-- <TextField type="text" {superform} field="thumbnailId" label="Thumbnail"></TextField> -->
			<input type="text" hidden name="thumbnailId" value={$formData.thumbnailId} />
			<input type="text" hidden name="mediaId" value={$formData.mediaId} />
			<Button type="submit">Submit</Button>
		</Form>
	{/if}
</div>
