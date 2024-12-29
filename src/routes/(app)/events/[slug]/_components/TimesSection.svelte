<script lang="ts">
	import { formatRelativeTime } from '$lib/helpers/formatRelativeTime';
	import { onDestroy } from 'svelte';
	import { type PageData } from '../$types';
	import { locale } from 'svelte-i18n';
	import { t } from '$lib/i18n';

	let { event }: { event: PageData['event'] } = $props();
	const now = new Date();
	let showCountdown = $state(event.submissionsOpenAt > now && event.submissionsCloseAt > now);

	function formatCountdown(targetDate: Date): string {
		const total = targetDate.getTime() - Date.now();

		const days = Math.floor(total / (1000 * 60 * 60 * 24));
		const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((total % (1000 * 60)) / 1000);

		return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	let countdown = $state(formatCountdown(event.submissionsCloseAt));

	// Update countdown every second
	let interval = setInterval(() => {
		countdown = formatCountdown(event.submissionsCloseAt);
	}, 1000);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="flex w-full flex-col gap-xl">
	<div>
		<h2>Submissions</h2>
		<div class="flex flex-1 flex-row gap-sm">
			<div class="flex-1">
				<p class="text-shade-300">Opens at</p>
				<p class="text-2xl font-bold">
					{new Intl.DateTimeFormat($locale ?? 'en', {
						dateStyle: 'long',
						timeStyle: 'short',
						hour12: false
					}).format(event.submissionsOpenAt)}
				</p>
			</div>
			<div class="flex-1">
				<p class="text-shade-300">{$t('Closes at')}</p>
				<p class="text-2xl font-bold">
					{new Intl.DateTimeFormat($locale ?? 'en', {
						dateStyle: 'long',
						timeStyle: 'short',
						hour12: false
					}).format(event.submissionsCloseAt)}
				</p>
			</div>
		</div>
	</div>
	<div>
		<h2>Voting</h2>
		<div class="flex flex-1 flex-row gap-sm">
			<div class="flex-1">
				<p class="text-shade-300">Opens at</p>
				<p class="text-2xl font-bold">
					{new Intl.DateTimeFormat($locale ?? 'en', {
						dateStyle: 'long',
						timeStyle: 'short',
						hour12: false
					}).format(event.votingOpenAt)}
				</p>
			</div>
			<div class="flex-1">
				<p class="text-shade-300">Closes at</p>
				<p class="text-2xl font-bold">
					{new Intl.DateTimeFormat($locale ?? 'en', {
						dateStyle: 'long',
						timeStyle: 'short',
						hour12: false
					}).format(event.votingCloseAt)}
				</p>
			</div>
		</div>
	</div>
</div>
