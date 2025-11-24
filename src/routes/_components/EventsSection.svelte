<script lang="ts">
	import type { PageData } from '../$types';
	import { locale } from 'svelte-i18n';
	import Button from '$lib/components/Button.svelte';
	import { getEventStatus } from '$lib/helpers/eventStatus';
	import { formatDateRange } from '$lib/helpers/formatDateRange';
	import { t } from '$lib/i18n';

	let { events }: { events: PageData['events'] } = $props();
	type Event = (typeof events)[number];
</script>

{#snippet event(event: Event)}
	{@const status = getEventStatus(event)}
	<div class="gap-sm rounded-form border-shade-700 p-xl flex flex-col justify-between border">
		<div class="flex flex-col">
			<h3 class="text-xl font-semibold">
				<a href="/events/{event.slug}">{event.name}</a>
			</h3>
			<p class="text-shade-300">{event.tagline}</p>
		</div>
		<div class="gap-xs flex flex-col">
			<a class="group text-shade-300 text-sm" href="/events/{event.slug}">
				<span class="group-hover:text-squid-400 text-white transition-colors"
					>{event.eventCategories.length}</span
				>
				{$t('categories')}
			</a>
			<div class="gap-xs inline-flex flex-wrap items-center justify-between text-sm font-bold">
				<p>
					{formatDateRange(
						new Date(event.submissionsOpenAt),
						new Date(event.votingCloseAt),
						$locale ?? 'en-US'
					)}
				</p>
				{#if status === 'submitting'}
					<p class="border-primary px-xs h-fit w-fit rounded-full border font-bold text-white">
						{$t('Open for submissions')}
					</p>
				{:else if status === 'voting'}
					<p class="border-secondary px-xs w-fit rounded-full border font-bold text-white">
						{$t('Open for voting')}
					</p>
				{:else if status === 'scheduled'}
					<p class="px-xs w-fit rounded-full border font-bold text-white">
						{$t('Upcoming')}
					</p>
				{/if}
			</div>
		</div>
	</div>
{/snippet}
<section class="gap-xl px-sm flex w-full max-w-(--breakpoint-xl) flex-col">
	<h2 class="text-center text-4xl font-bold">{$t('Current and upcoming events')}</h2>

	<div class="gap-sm md:gap-xl grid grid-cols-1 md:grid-cols-3">
		{#each events.slice(0, 3) as eventData (eventData.id)}
			{@render event(eventData)}
		{/each}
	</div>

	<div class="text-center">
		<Button href="/events">{$t('View all events')}</Button>
	</div>
</section>
