<script lang="ts">
	import LicenseTooltip from '$lib/components/LicenseTooltip.svelte';

	import { DownloadIcon } from 'lucide-svelte';

	import type { PageData } from '../$types';
	import VoteButton from './VoteButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import { t } from '$lib/i18n';
	import DeleteButton from './DeleteButton.svelte';

	let {
		entry,
		user,
		isVoted = $bindable()
	}: {
		entry: NonNullable<PageData['entry']>;
		user: PageData['user'];
		isVoted: boolean;
	} = $props();
</script>

<section id="entry-info" class="flex items-center justify-between gap-lg text-gray-500">
	<div id="entry-meta" class="flex flex-1 flex-wrap items-center gap-lg text-lg">
		<p><span class="text-white">{entry.views}</span> {$t('Views')}</p>
		<p><span class="text-white">{entry.reactions.length}</span> {$t('Reactions')}</p>
		<p id="entry-meta-license" class="inline-flex items-center gap-xs">
			<span class="text-white">{entry.license.toUpperCase()}</span>
			<LicenseTooltip license={entry.license} />
		</p>
	</div>

	<!-- Actions -->
	<div id="entry-actions" class="flex flex-1 justify-end gap-sm">
		<Button
			variant="outline"
			size="icon"
			href={entry.media.url}
			download={entry.media.name ?? undefined}
		>
			<DownloadIcon />
		</Button>
		<!-- TODO share button
    <Button variant="outline" size="icon">
        <ShareIcon />
    </Button> -->
		<!-- <ReactionButton {entryId} bind:isAllowedToReact /> -->
		{#if user?.username === entry.user?.username}
			<DeleteButton {entry} {user} />
		{:else}
			<VoteButton isSignedIn={user != null} id={entry.id} bind:isVoted />
		{/if}
	</div>
</section>
