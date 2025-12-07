<script lang="ts">
	import { page } from '$app/stores';
	import type { CreateEntrySchema } from '$lib/schemas/entry';
	import { getContext } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { PageData } from '../$types';
	import { t } from '$lib/i18n';
	let { form } = getContext<SuperForm<CreateEntrySchema>>('superform');
	let events: PageData['events'] = $state($page.data.events);
	let event = $derived(events?.find((e) => e.eventId?.toString() === $form.eventId.toString()));
	let category = $derived(event?.categories.find((c) => String(c.id) === String($form.categoryId)));
</script>

{#if event != null && category != null}
	<p class="text-shade-300 text-center text-xl font-bold">
		{$t('Submitting to')} <span class="text-white">{category?.name}</span> in
		<span class="text-white">{event?.name}</span>
	</p>
{/if}
