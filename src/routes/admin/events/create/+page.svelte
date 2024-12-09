<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DumbDate from '$lib/components/Form/DumbDate.svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import { CalendarDateTime, getLocalTimeZone } from '@internationalized/date';
	import {
		CalendarArrowUpIcon,
		CalendarHeartIcon,
		CalendarX2Icon,
		LockOpenIcon,
		PencilIcon,
		PlusIcon
	} from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import CategoryInput from './_components/CategoryInput.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import { tick } from 'svelte';

	let { data }: { data: PageData } = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.eventForm, {
		dataType: 'json'
	});

	const timezone = getLocalTimeZone();

	let rulesContainerRef: HTMLUListElement | undefined = $state(undefined);
	let submissionsOpenAt = $state<CalendarDateTime>(
		new CalendarDateTime(
			$form.submissionsOpenAt.getFullYear(),
			$form.submissionsOpenAt.getMonth(),
			$form.submissionsOpenAt.getDate(),
			$form.submissionsOpenAt.getHours(),
			$form.submissionsOpenAt.getMinutes()
		)
	);
	let submissionsCloseAt = $state<CalendarDateTime>(
		new CalendarDateTime(
			$form.submissionsCloseAt.getFullYear(),
			$form.submissionsCloseAt.getMonth(),
			$form.submissionsCloseAt.getDate(),
			$form.submissionsCloseAt.getHours(),
			$form.submissionsCloseAt.getMinutes()
		)
	);
	let votingOpenAt = $state<CalendarDateTime>(
		new CalendarDateTime(
			$form.votingOpenAt.getFullYear(),
			$form.votingOpenAt.getMonth(),
			$form.votingOpenAt.getDate(),
			$form.votingOpenAt.getHours(),
			$form.votingOpenAt.getMinutes()
		)
	);
	let votingCloseAt = $state<CalendarDateTime>(
		new CalendarDateTime(
			$form.votingCloseAt.getFullYear(),
			$form.votingCloseAt.getMonth(),
			$form.votingCloseAt.getDate(),
			$form.votingCloseAt.getHours(),
			$form.votingCloseAt.getMinutes()
		)
	);

	$effect(() => {
		$form.submissionsOpenAt = submissionsOpenAt.toDate(timezone);
	});

	$effect(() => {
		$form.submissionsCloseAt = submissionsCloseAt.toDate(timezone);
	});

	$effect(() => {
		$form.votingOpenAt = votingOpenAt.toDate(timezone);
	});

	$effect(() => {
		$form.votingCloseAt = votingCloseAt.toDate(timezone);
	});

	const handleAddRule = async () => {
		$form.rules = [...$form.rules, { text: '', isLocked: false }];

		tick().then(() => {
			const inputs = rulesContainerRef?.querySelectorAll('.event-rule');
			if (inputs?.length) {
				(inputs[inputs.length - 1] as HTMLInputElement).focus();
			}
		});
	};
</script>

<div class="flex w-full max-w-screen-md flex-col gap-xl py-xl">
	{#if $message}<h3>{JSON.stringify($message)}</h3>{/if}
	<form
		method="POST"
		use:enhance
		class="flex flex-col gap-xl"
		onkeydowncapture={(e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
			}
		}}
	>
		<DumbInput
			label="Name"
			labelProps={{ class: 'text-h3' }}
			type="text"
			name="name"
			aria-invalid={$errors.name ? 'true' : undefined}
			bind:value={$form.name}
			{...$constraints.name}
		/>
		{#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}

		<DumbInput
			label="Description"
			labelProps={{ class: 'text-h3' }}
			type="textarea"
			name="description"
			aria-invalid={$errors.description ? 'true' : undefined}
			bind:value={$form.description}
			{...$constraints.description}
		/>
		{#if $errors.description}<span class="invalid">{$errors.description}</span>{/if}

		<div class="flex gap-xl">
			<DumbDate
				class="flex-1"
				icon={CalendarArrowUpIcon}
				iconProps={{ class: '-mt-[2px]' }}
				labelText="Submissions Open At"
				name="submissionsOpenAt"
				bind:value={submissionsOpenAt}
				inputProps={{ ...$constraints.submissionsOpenAt }}
			/>
			{#if $errors.submissionsOpenAt}<span class="invalid">{$errors.submissionsOpenAt}</span>{/if}

			<DumbDate
				class="flex-1"
				icon={CalendarX2Icon}
				iconProps={{ class: '-mt-[2px]' }}
				labelText="Submissions Close At"
				name="submissionsCloseAt"
				bind:value={submissionsCloseAt}
				inputProps={{ ...$constraints.submissionsCloseAt }}
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
				inputProps={{ ...$constraints.votingOpenAt }}
			/>
			{#if $errors.votingOpenAt}<span class="invalid">{$errors.votingOpenAt}</span>{/if}

			<DumbDate
				class="flex-1"
				icon={CalendarX2Icon}
				iconProps={{ class: '-mt-[2px]' }}
				labelText="Voting Close At"
				name="votingCloseAt"
				bind:value={votingCloseAt}
				inputProps={{ ...$constraints.votingCloseAt }}
			/>
			{#if $errors.votingCloseAt}<span class="invalid">{$errors.votingCloseAt}</span>{/if}
		</div>
		<Divider />
		<div class="flex items-center justify-between">
			<h3>General Rules</h3>
			<Button icon={PlusIcon} variant="outline" onclick={handleAddRule}>Add Rule</Button>
		</div>
		{#if $form.rules.length > 0}
			<ul class="flex flex-col gap-sm" bind:this={rulesContainerRef}>
				{#each $form.rules as _, index}
					<li class="flex items-center gap-sm">
						<DumbInput
							type="text"
							onkeydowncapture={(e: KeyboardEvent) => {
								if (e.key === 'Enter') {
									$form.rules[index].isLocked = true;
									handleAddRule();
								}
							}}
							bind:value={$form.rules[index].text}
							class="event-rule"
							disabled={$form.rules[index].isLocked}
							icon={$form.rules[index].isLocked ? PencilIcon : LockOpenIcon}
							iconProps={{
								onclick: () => ($form.rules[index].isLocked = !$form.rules[index].isLocked),
								class:
									'cursor-pointer text-white p-xs -mr-xs rounded-xs w-3xl h-3xl hover:bg-muted-background transition-colors'
							}}
						/>
					</li>
				{/each}
			</ul>
		{/if}

		<Divider />
		<div class="flex items-center justify-between">
			<h3>Categories</h3>
			<Button
				icon={PlusIcon}
				variant="outline"
				onclick={() => ($form.categories = [...$form.categories, { categoryId: 0, rules: [] }])}
			>
				Add Category
			</Button>
		</div>
		{#each $form.categories as _, index}
			<CategoryInput
				category={$form.categories[index]}
				setCategory={(data) => ($form.categories[index] = data)}
			/>
		{/each}
		<Divider />
		<div class="flex justify-center"><Button type="submit">Create Event</Button></div>
	</form>
</div>

<style>
	.invalid {
		color: red;
	}
</style>
