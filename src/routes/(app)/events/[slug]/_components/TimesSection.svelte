<script lang="ts">
	import { type PageData } from '../$types';
	import { locale } from 'svelte-i18n';
	import { t } from '$lib/i18n';

	let { event }: { event: PageData['event'] } = $props();
</script>

<div class="gap-xl flex w-full flex-col">
	<div>
		<h2>Submissions</h2>
		<div class="gap-sm flex flex-1 flex-row">
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
		<div class="gap-sm flex flex-1 flex-row">
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
