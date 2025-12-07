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
	class="gap-xl rounded-form border-shade-700 p-xl flex flex-col justify-between border md:flex-row md:items-center"
>
	<div class="gap-sm flex flex-col">
		<div class="gap-sm flex flex-col">
			<div class="gap-sm md:gap-xl flex w-full flex-col flex-wrap md:flex-row md:items-center">
				<h3>
					<a href="/events/{event.slug}">{event.name}</a>
				</h3>
				{@render pill()}
			</div>
			<p class="text-shade-300">{event.tagline}</p>
		</div>
		<div class="h-form gap-sm md:gap-xl flex flex-wrap items-center">
			<div
				class="gap-xs inline-flex w-full flex-wrap items-center justify-between font-bold md:w-fit"
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
				<span class="group-hover:text-squid-400 text-white transition-colors">
					{event.eventCategories.length}
				</span>
				{$t('categories')}
			</a>
			<p class=" text-shade-300">
				<span class="group-hover:text-squid-400 text-white transition-colors">
					{event.participants}
				</span>
				{$t('Participants')}
			</p>
		</div>
	</div>
	<div class="gap-sm flex w-full md:w-fit md:flex-col">
		<Button class="w-full" href="/entries?event={event.id}">{$t('Entries')}</Button>
		<Button class="w-full" variant="outline" href="/events/{event.slug}">{$t('Rules')}</Button>
	</div>
</div>

<style lang="postcss">
	@reference "../../../../app.css";

	.pill {
		@apply px-sm h-fit w-fit rounded-full border font-bold text-white;

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
