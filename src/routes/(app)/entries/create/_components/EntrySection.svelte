<script lang="ts">
	import EventRow from './EventRow.svelte';
	import CategoryRow from './CategoryRow.svelte';
	import { page } from '$app/stores';
	import { createEntrySchema, type CreateEntrySchema } from '$lib/schemas/entry';
	import type { SuperForm } from 'sveltekit-superforms';
	import { getContext } from 'svelte';
	import type { PageData } from '../$types';
	import Link from '$lib/components/Link.svelte';

	let { isValid = $bindable() }: { isValid: boolean } = $props();
	let { form } = getContext<SuperForm<CreateEntrySchema>>('superform');
	let events: PageData['events'] = $state($page.data.events);
	let event = $derived(events?.find((e) => e.eventId?.toString() === $form.eventId.toString()));

	$effect(() => {
		isValid = createEntrySchema.pick({ eventId: true, categoryId: true }).safeParse($form).success;
	});
</script>

<section class="gap-xl flex flex-col">
	<div class="gap-xs flex flex-col">
		<EventRow />
		<div class="text-shade-300">
			If you can't find the event, ensure the <Link href="/profile#tickets">ticket</Link> is added to
			your profile.
		</div>
	</div>
	<div class="gap-xs flex flex-col">
		<CategoryRow />
		<p class="text-shade-300">
			You can submit only one entry per category, so previous entries are disabled.
		</p>
	</div>
	<div class="gap-sm flex flex-col">
		<h3>Rules</h3>
		<h4>General Rules</h4>
		<ul class="text-shade-300 list-inside list-disc">
			{#if $form.eventId}
				{#each event?.rules ?? [] as rule, i (i)}
					<li>{rule}</li>
				{/each}
			{:else}
				<p>Choose an event to see the rules.</p>
			{/if}
		</ul>
		<h4>Category Rules</h4>
		<ul class="text-shade-300 list-inside list-disc">
			{#if $form.categoryId}
				{#each event?.categories ?? [] as category (category.id)}
					{#if category.id.toString() === $form.categoryId.toString()}
						{#each category.rules ?? [] as rule, i (i)}
							<li>{rule}</li>
						{/each}
					{/if}
				{/each}
			{:else}
				<p>Choose a category to see the rules.</p>
			{/if}
		</ul>
	</div>
</section>
