<script lang="ts">
	import { page } from '$app/stores';
	import Divider from '$lib/components/Divider.svelte';
	import GenericForm from '$lib/components/Form/GenericForm.svelte';
	import { cn } from '$lib/utils';
	import { Tabs } from 'bits-ui';
	import ButtonsSection from './ButtonsSection.svelte';
	import EntrySection from './EntrySection.svelte';
	import FilesSection from './FilesSection.svelte';
	import FinishSection from './FinishSection.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { createEntrySchema } from '$lib/schemas/entry';

	// TODO Improve navigation guard
	// TODO Use more semantic naming for tabs
	let currentTab = $state('1');
	let step1Valid = $state(false);
	let step2Valid = $state(false);
	let step3Valid = $state(false);

	const tabs = ['Entry', 'Files', 'Finishing up'];
</script>

{#snippet tab(value: string, label: string)}
	<div
		class={cn(
			'flex flex-1 flex-col items-center gap-sm font-bold text-shade-300',
			currentTab >= value && 'text-white'
		)}
	>
		<Tabs.Trigger
			{value}
			class={cn(
				'flex size-form items-center justify-center rounded-full border border-shade-600 data-[state=active]:bg-white data-[state=active]:text-black',
				currentTab >= value && 'border-white'
			)}
		>
			{value}
		</Tabs.Trigger>
		{label}
	</div>
{/snippet}

<!-- TODO Store state in url -->
<!-- TODO Redirect to tab 1 if not valid selections -->
<!-- TODO Show add ticket form if no valid tickets -->
<Tabs.Root bind:value={currentTab} controlledValue disabled>
	<GenericForm
		data={$page.data.form}
		class="my-3xl gap-xl px-sm md:px-xl"
		options={{ validators: zod(createEntrySchema) }}
	>
		<Tabs.List class="flex w-full justify-evenly">
			{#each tabs as t, index}
				{@render tab(String(index + 1), t)}
			{/each}
		</Tabs.List>

		<Divider />

		<Tabs.Content value="1">
			<EntrySection bind:isValid={step1Valid} />
		</Tabs.Content>
		<Tabs.Content value="2">
			<FilesSection bind:isValid={step2Valid} />
		</Tabs.Content>
		<Tabs.Content value="3">
			<FinishSection bind:isValid={step3Valid} />
		</Tabs.Content>
		<Divider variant="invisible" />
		<ButtonsSection
			bind:currentTab
			tabsCount={tabs.length}
			{step1Valid}
			{step2Valid}
			{step3Valid}
		/>
	</GenericForm>
</Tabs.Root>
