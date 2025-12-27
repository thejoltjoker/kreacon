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
		isVoted = $bindable(),
		isOpenForVoting = $bindable()
	}: {
		entry: NonNullable<PageData['entry']>;
		user: PageData['user'];
		isVoted: boolean;
		isOpenForVoting: boolean;
	} = $props();
</script>

{#if entry.description}
	<section id="entry-description" class="gap-xs flex flex-col">
		<p class="text-shade-300">{entry.description}</p>
	</section>
{/if}
<section id="entry-info" class="gap-lg flex items-center justify-between text-gray-500">
	<div id="entry-meta" class="gap-lg flex flex-1 flex-wrap items-center text-lg">
		<p><span class="text-white">{entry.views}</span> {$t('Views')}</p>
		<p><span class="text-white">{entry.reactions.length}</span> {$t('Reactions')}</p>
		<p id="entry-meta-license" class="gap-xs inline-flex items-center">
			<span class="text-white">{entry.license.toUpperCase()}</span>
			<LicenseTooltip license={entry.license} />
		</p>
	</div>

	<!-- Actions -->
	<div id="entry-actions" class="gap-sm flex flex-1 justify-end">
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
			<VoteButton isSignedIn={user != null} id={entry.id} bind:isVoted {isOpenForVoting} />
		{/if}
	</div>
</section>
