<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getEventStatus } from '$lib/helpers/eventStatus';
	import { formatDateRange } from '$lib/helpers/formatDateRange';
	import { t } from '$lib/i18n';
	import type { PageData } from '../$types';
	import { locale } from 'svelte-i18n';

	interface EventListItemProps {
		event: PageData['events'][number];
	}
	let { event }: EventListItemProps = $props();
	const status = getEventStatus(event);
</script>

{#snippet pill()}
	{#if status === 'submitting'}
		<p class="pill submissions">
			{$t('Open for submissions')}
		</p>
	{:else if status === 'voting'}
		<p class="pill voting">
			{$t('Open for voting')}
		</p>
	{:else if status === 'scheduled'}
		<p class="pill scheduled">
			{$t('Upcoming')}
		</p>
	{:else if status === 'closed'}
		<p class="pill closed">
			{$t('Closed')}
		</p>
	{/if}
{/snippet}

<div
	class="flex flex-col justify-between gap-xl rounded-form border border-shade-700 p-xl md:flex-row md:items-center"
>
	<div class="flex flex-col gap-sm">
		<div class="flex flex-col gap-sm">
			<div class="flex w-full flex-col flex-wrap gap-sm md:flex-row md:items-center md:gap-xl">
				<h3>
					<a href="/events/{event.slug}">{event.name}</a>
				</h3>
				{@render pill()}
			</div>
			<p class="text-shade-300">{event.tagline}</p>
		</div>
		<div class="flex h-form flex-wrap items-center gap-sm md:gap-xl">
			<div
				class="inline-flex w-full flex-wrap items-center justify-between gap-xs font-bold md:w-fit"
			>
				<p>
					{formatDateRange(
						new Date(event.submissionsOpenAt),
						new Date(event.votingCloseAt),
						$locale ?? 'en-US'
					)}
				</p>
			</div>
			<a class="group text-shade-300" href="/events/{event.slug}">
				<span class="text-white transition-colors group-hover:text-squid-400">
					{event.eventCategories.length}
				</span>
				{$t('categories')}
			</a>
			<p class=" text-shade-300">
				<span class="text-white transition-colors group-hover:text-squid-400">
					{event.participants}
				</span>
				{$t('Participants')}
			</p>
		</div>
	</div>
	<div class="flex w-full gap-sm md:w-fit md:flex-col">
		<Button class="w-full" href="/entries/{event.slug}">{$t('Entries')}</Button>
		<Button class="w-full" variant="outline" href="/events/{event.slug}">{$t('Rules')}</Button>
	</div>
</div>

<style lang="postcss">
	.pill {
		@apply h-fit w-fit rounded-full border px-sm font-bold text-white;

		&.submissions {
			@apply border-primary text-white;
		}
		&.voting {
			@apply border-secondary text-white;
		}
		&.closed {
			@apply border-shade-700 text-shade-300;
		}
		&.scheduled {
			@apply border-tertiary text-white;
		}
	}
</style>
