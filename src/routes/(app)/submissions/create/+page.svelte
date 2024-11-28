<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Label, type SelectItemProps } from 'bits-ui';
	import type { PageData } from './$types';
	import Form from '$lib/components/Form/Form.svelte';
	import Text from '$lib/components/Form/Text.svelte';
	import Select from '$lib/components/Form/Select.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import File from '$lib/components/Form/File.svelte';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, { resetForm: false });
	const formData = form.form;
	let showSuccessAnimation = $state(false);
	let disabled = $state(false);
	let categories: SelectItemProps[] = $state([]);

	$effect(() => {
		const event = data.events?.find((e) => e.eventId?.toString() === $formData.eventId.toString());
		categories =
			event?.categories?.map((c) => ({
				label: c.name ?? 'Unknown',
				value: c.id.toString(),
				disabled: c.isDisabled ?? false
			})) ?? [];
	});
</script>

<div class="mx-auto max-w-screen-md">
	<SuperDebug data={$formData} />
	{#if data.form}
		<Form
			{form}
			bind:showSuccessAnimation
			bind:disabled
			class="flex flex-col gap-md"
			enctype="multipart/form-data"
		>
			<!-- {#if message}
			<div
				class="status"
				class:error={message.status >= 400}
				class:success={!message.status || message.status < 300}
			>
				{message.text}
			</div>
		{/if} -->
			<File {form} {disabled} field="media" />

			<Label.Root class="flex flex-col gap-xs" for="eventId">
				<h6>Event</h6>
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
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						$formData.categoryId = '' as any; // Ugly type hack because category wants number
					}}
				/>
				<p class="text-muted-foreground-light">
					Can't find the event you're looking for? Make sure you've
					<a href="/profile/tickets"> added the ticket to your profile </a>.
				</p>
			</Label.Root>

			<Label.Root class="flex flex-col gap-xs" for="categoryId">
				<h6>Category</h6>
				<Select
					{form}
					label="Select a category"
					field="categoryId"
					disabled={disabled || $formData.eventId == null}
					items={categories}
				/>
			</Label.Root>

			<Label.Root class="flex flex-col gap-xs" for="title">
				<h6>Title</h6>
				<Text {form} type="text" field="title" {disabled} />
			</Label.Root>

			<!-- TODO File input for thumbnail, generate locally, wasm? -->

			<Button type="submit">Submit</Button>
		</Form>
	{/if}
</div>
