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
	<div class="flex flex-col justify-between gap-sm rounded-form border border-shade-700 p-xl">
		<div class="flex flex-col">
			<h3 class="text-xl font-semibold">
				<a href="/events/{event.slug}">{event.name}</a>
			</h3>
			<p class="text-shade-300">{event.tagline}</p>
		</div>
		<div class="flex flex-col gap-xs">
			<a class="group text-sm text-shade-300" href="/events/{event.slug}">
				<span class="text-white transition-colors group-hover:text-squid-400"
					>{event.eventCategories.length}</span
				>
				{$t('categories')}
			</a>
			<div class="inline-flex flex-wrap items-center justify-between gap-xs text-sm font-bold">
				<p>
					{formatDateRange(
						new Date(event.submissionsOpenAt),
						new Date(event.votingCloseAt),
						$locale ?? 'en-US'
					)}
				</p>
				{#if status === 'submitting'}
					<p class="h-fit w-fit rounded-full border border-primary px-xs font-bold text-white">
						{$t('Open for submissions')}
					</p>
				{:else if status === 'voting'}
					<p class="w-fit rounded-full border border-secondary px-xs font-bold text-white">
						{$t('Open for voting')}
					</p>
				{:else if status === 'scheduled'}
					<p class="w-fit rounded-full border px-xs font-bold text-white">
						{$t('Upcoming')}
					</p>
				{/if}
			</div>
		</div>
	</div>
{/snippet}
<section class="flex w-full max-w-(--breakpoint-xl) flex-col gap-xl px-sm">
	<h2 class="text-center text-4xl font-bold">{$t('Current and upcoming events')}</h2>

	<div class="grid grid-cols-1 gap-sm md:grid-cols-3 md:gap-xl">
		{#each events.slice(0, 3) as eventData}
			{@render event(eventData)}
		{/each}
	</div>

	<div class="text-center">
		<Button href="/events">{$t('View all events')}</Button>
	</div>
</section>
