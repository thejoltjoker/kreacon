<script lang="ts">
	import { CameraIcon } from 'lucide-svelte';
	import type { PageData } from '../$types';
	import { locale } from 'svelte-i18n';
	import { t } from '$lib/i18n';
	import Button from '$lib/components/Button.svelte';
	import { getEventStatus } from '$lib/helpers/eventStatus';

	let { events }: { events: PageData['events'] } = $props();
	type Event = (typeof events)[number];
</script>

{#snippet event(event: Event)}
	{@const status = getEventStatus(event)}
	<div class="flex flex-col justify-between rounded-form border border-shade-700 p-xl">
		<div class="flex flex-col gap-sm">
			<h3 class="text-xl font-semibold">{event.name}</h3>
			<p class="mb-lg text-shade-300">{event.description}</p>
			<!-- <p class="mt-auto text-sm font-semibold">
				{$t('Submissions open at')}: {new Date(event.submissionsOpenAt).toLocaleString(
					$locale ?? 'sv-SE',
					{
						hour: '2-digit',
						minute: '2-digit',
						month: 'short',
						day: 'numeric',
						year: 'numeric'
						}
						)}
						</p> -->
		</div>
		<div class=" inline-flex items-center justify-between gap-xs text-sm font-bold">
			<p>
				{new Date(event.submissionsOpenAt).toLocaleString($locale ?? 'en-US', {
					month: 'short'
				})}
				{new Date(event.submissionsOpenAt).toLocaleString($locale ?? 'en-US', {
					day: 'numeric'
				})}
				{' - '}
				{new Date(event.votingCloseAt).toLocaleString($locale ?? 'en-US', {
					day: 'numeric'
				})},
				{new Date(event.votingCloseAt).getFullYear()}
			</p>
			{#if status === 'submitting'}
				<p class="h-fit w-fit rounded-full border border-primary px-xs font-bold text-white">
					Open for submissions
				</p>
			{:else if status === 'voting'}
				<p class="w-fit rounded-full border border-secondary px-xs font-bold text-white">
					Open for voting
				</p>
			{:else if status === 'scheduled'}
				<p class="w-fit rounded-full border px-xs font-bold text-white">Upcoming</p>
			{/if}
		</div>
	</div>
{/snippet}
<section class="flex flex-col gap-lg px-md py-5xl">
	<h2 class="mb-3xl text-center text-4xl font-bold">Current and upcoming events</h2>

	<div class="mx-auto grid max-w-screen-xl grid-cols-1 gap-xl md:grid-cols-3">
		{#each events as eventData}
			{@render event(eventData)}
		{/each}
	</div>

	<div class="mt-3xl text-center">
		<Button href="/events">View All Events</Button>
	</div>
</section>
