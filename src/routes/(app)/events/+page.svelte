<script lang="ts">
	import { getEventStatus } from '$lib/helpers/eventStatus';
	import { t } from '$lib/i18n';
	import type { PageData } from './$types';
	import EventListItem from './_components/EventListItem.svelte';
	import capitalize from 'lodash/capitalize';

	let { data }: { data: PageData } = $props();

	let events = $derived.by(() =>
		data.events.map((event) => ({
			...event,
			status: getEventStatus(event)
		}))
	);

	let groupedEvents = $derived({
		current: events.filter((e) => e.status === 'submitting' || e.status === 'voting'),
		upcoming: events.filter((e) => e.status === 'scheduled'),
		past: events.filter((e) => e.status === 'closed')
	});
</script>

<main class="flex w-full max-w-screen-lg flex-col gap-xl px-sm pt-xl">
	{#each Object.entries(groupedEvents) as [group, events]}
		{#if events.length > 0}
			<section class="flex flex-col gap-sm">
				<h2>{$t(`${capitalize(group)} events`)}</h2>
				<div class="flex flex-col gap-xl">
					{#each events as event}
						<EventListItem {event} />
					{/each}
				</div>
			</section>
		{/if}
	{/each}
</main>
