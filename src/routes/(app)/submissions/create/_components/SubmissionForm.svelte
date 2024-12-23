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

	let currentTab = $state('1');

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
<!-- TODO Show loading state -->
<Tabs.Root bind:value={currentTab} controlledValue disabled>
	<GenericForm debug data={$page.data.form} class="my-3xl gap-3xl px-sm md:px-xl">
		<Tabs.List class="flex w-full justify-evenly">
			{#each tabs as t, index}
				{@render tab(String(index + 1), t)}
			{/each}
		</Tabs.List>

		<Divider class="my-xl" />

		<Tabs.Content value="1">
			<EntrySection />
			<!-- </Tabs.Content>
		<Tabs.Content value="2"> -->
			<FilesSection />
			<!-- </Tabs.Content>
		<Tabs.Content value="3"> -->
			<FinishSection />
		</Tabs.Content>
		<Divider variant="invisible" />
		<ButtonsSection bind:currentTab tabsCount={1} />
	</GenericForm>
</Tabs.Root>
