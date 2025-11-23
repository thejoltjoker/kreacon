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
	let noEvents = $derived(Object.values(groupedEvents).every((events) => events.length === 0));
</script>

<main class="flex h-full w-full max-w-(--breakpoint-lg) grow flex-col gap-xl px-sm pt-xl">
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

	{#if noEvents}
		<section class="flex grow flex-col items-center justify-center gap-sm text-center">
			<h2>{$t('No events yet')}</h2>
			<p>{$t('Check back later for new events!')}</p>
		</section>
	{/if}
</main>
