<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import GenericForm from '$lib/components/Form/GenericForm.svelte';
	import SelectField from '$lib/components/Form/SelectField.svelte';
	import TextField from '$lib/components/Form/TextField.svelte';
	// import File from '$lib/components/Form/File.svelte';
	// import Form from '$lib/components/Form/Form.svelte';
	// import Select from '$lib/components/Form/Select.svelte';
	// import Text from '$lib/components/Form/Text.svelte';
	// import { Label, type SelectItemProps } from 'bits-ui';
	// import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import SubmissionForm from './_components/SubmissionForm.svelte';

	let { data }: { data: PageData } = $props();

	// const form = superForm(data.form, { resetForm: false });
	// const formData = form.form;
	// let showSuccessAnimation = $state(false);
	// let disabled = $state(false);
	// let categories: SelectItemProps[] = $state([]);

	// const { message } = form;

	// $effect(() => {
	// 	const event = data.events?.find((e) => e.eventId?.toString() === $formData.eventId.toString());
	// 	categories =
	// 		event?.categories?.map((c) => ({
	// 			label: c.name ?? 'Unknown',
	// 			value: c.id.toString(),
	// 			disabled: c.isDisabled ?? false
	// 		})) ?? [];
	// });
</script>

<section class="w-full max-w-screen-md">
	<SubmissionForm />
</section>
<!-- <div class="w-full max-w-screen-md">
	{#if data.form}
		<Form
			{form}
			bind:showSuccessAnimation
			bind:disabled
			class="flex flex-col gap-md"
			enctype="multipart/form-data"
		>
			{#if $message}
				<div
					class="status"
					class:error={$message.status === 'error'}
					class:success={$message.status === 'success'}
				>
					{$message.text}
				</div>
			{/if}
			<Label.Root class="flex flex-col gap-xs" for="title">
				<h3>Title</h3>
				<Text {form} type="text" field="title" {disabled} />
			</Label.Root>

			<File {form} {disabled} field="media" />

			<Label.Root class="flex flex-col gap-xs" for="eventId">
				<h3>Event</h3>
				<Select
					{form}
					label="Select an event"
					field="eventId"
					{disabled}
					items={data.events.map((e) => ({
						label: e.name ?? 'Unknown',
						value: e.eventId?.toString() ?? ''
					}))}
					onValueChange={() => {
						$formData.categoryId = '' as unknown as number; // Type hack because category wants number
					}}
				/>
				<p class="text-muted-foreground-light">
					Can't find the event you're looking for? Make sure you've
					<a href="/profile/tickets"> added the ticket to your profile </a>.
				</p>
			</Label.Root>

			<Label.Root class="flex flex-col gap-xs" for="categoryId">
				<h3>Category</h3>
				<Select
					{form}
					label="Select a category"
					field="categoryId"
					disabled={disabled || $formData.eventId == null}
					items={categories}
				/>
			</Label.Root>

			<Button type="submit">Submit</Button>
		</Form>
	{/if}
</div> -->
