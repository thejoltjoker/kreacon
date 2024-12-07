<script lang="ts">
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import kebabCase from 'lodash/kebabCase';
	import type { PageData } from './$types';
	import { stringProxy, superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import Button from '$lib/components/Button.svelte';
	import DumbDate from '$lib/components/Form/DumbDate.svelte';
	import { CalendarDateTime, parseAbsolute } from '@internationalized/date';
	import {
		CalendarArrowUpIcon,
		CalendarHeartIcon,
		CalendarIcon,
		CalendarX2Icon
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.eventForm);
	let slug = $derived(kebabCase($form.name));

	let now = new Date();
	let nowCalendarDateTime = new CalendarDateTime(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		now.getHours(),
		now.getMinutes()
	);
	let submissionsOpenAt = $state<CalendarDateTime>(nowCalendarDateTime);
	let submissionsCloseAt = $state<CalendarDateTime>(nowCalendarDateTime.add({ days: 7 }));
	let votingOpenAt = $state<CalendarDateTime>(nowCalendarDateTime.add({ days: 7 }));
	let votingCloseAt = $state<CalendarDateTime>(nowCalendarDateTime.add({ days: 14 }));

	$effect(() => {
		console.log('Converting to date');
		$form.submissionsOpenAt = submissionsOpenAt.toDate();
	});
</script>

<div class="flex w-full max-w-screen-md flex-col gap-xl py-xl">
	<SuperDebug data={$form} />
	{#if $message}<h3>{$message}</h3>{/if}
	<form method="POST" use:enhance class="flex flex-col gap-xl">
		<DumbInput
			label="Name"
			type="text"
			name="name"
			aria-invalid={$errors.name ? 'true' : undefined}
			bind:value={$form.name}
			{...$constraints.name}
		/>
		{#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
		<DumbInput
			label="Slug"
			type="text"
			name="slug"
			aria-invalid={$errors.slug ? 'true' : undefined}
			disabled
			value={slug}
			errors={$errors.slug}
			{...$constraints.slug}
		/>
		{#if $errors.slug}<span class="invalid">{$errors.slug}</span>{/if}

		<DumbInput
			label="Description"
			type="textarea"
			name="description"
			aria-invalid={$errors.description ? 'true' : undefined}
			bind:value={$form.description}
			{...$constraints.description}
		/>
		{#if $errors.description}<span class="invalid">{$errors.description}</span>{/if}

		<!-- TODO Dumb date inputs -->
		<div class="flex gap-xl">
			<DumbDate
				class="flex-1"
				icon={CalendarArrowUpIcon}
				iconProps={{ class: '-mt-[2px]' }}
				labelText="Submissions Open At"
				name="submissionsOpenAt"
				bind:value={submissionsOpenAt}
				{...$constraints.submissionsOpenAt}
			/>
			{#if $errors.submissionsOpenAt}<span class="invalid">{$errors.submissionsOpenAt}</span>{/if}

			<DumbDate
				class="flex-1"
				icon={CalendarX2Icon}
				iconProps={{ class: '-mt-[2px]' }}
				labelText="Submissions Close At"
				name="submissionsCloseAt"
				bind:value={submissionsCloseAt}
				{...$constraints.submissionsCloseAt}
			/>
			{#if $errors.submissionsCloseAt}<span class="invalid">{$errors.submissionsCloseAt}</span>{/if}
		</div>
		<div class="flex gap-xl">
			<DumbDate
				class="flex-1"
				icon={CalendarHeartIcon}
				iconProps={{ class: '-mt-[2px]' }}
				labelText="Voting Open At"
				name="votingOpenAt"
				bind:value={votingOpenAt}
				{...$constraints.votingOpenAt}
			/>
			{#if $errors.votingOpenAt}<span class="invalid">{$errors.votingOpenAt}</span>{/if}

			<DumbDate
				class="flex-1"
				icon={CalendarX2Icon}
				iconProps={{ class: '-mt-[2px]' }}
				labelText="Voting Close At"
				name="votingCloseAt"
				bind:value={votingCloseAt}
				{...$constraints.votingCloseAt}
			/>
			{#if $errors.votingCloseAt}<span class="invalid">{$errors.votingCloseAt}</span>{/if}
		</div>
		<div><Button type="submit">Submit</Button></div>
	</form>
</div>

<style>
	.invalid {
		color: red;
	}
</style>
