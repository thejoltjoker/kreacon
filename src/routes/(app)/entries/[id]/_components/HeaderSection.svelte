<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import { formatRelativeTime } from '$lib/helpers/formatRelativeTime';
	import { type PageData } from '../$types';
	import DeleteButton from './DeleteButton.svelte';
	import VoteButton from './VoteButton.svelte';

	let {
		entry,
		isVoted = $bindable(),
		user
	}: {
		entry: NonNullable<PageData['entry']>;
		isVoted: boolean;
		user: NonNullable<PageData['user']>;
	} = $props();
	let isOwner = $derived(user?.username === entry?.user?.username);
</script>

<section id="entry-header" class="flex flex-col gap-sm md:gap-xl">
	<div class="flex flex-wrap items-center justify-between gap-xs">
		<div id="entry-header-title" class="inline-flex items-center gap-xs">
			<h1 class="text-2xl font-bold">
				{entry.title}
			</h1>
			{#if isOwner}
				{#if entry.status === 'rejected'}
					<Badge size="lg" variant="destructive">{entry.status.toUpperCase()}</Badge>
				{:else if entry.status === 'published'}
					<Badge size="lg" variant="primary">{entry.status.toUpperCase()}</Badge>
				{:else if entry.status === 'pending'}
					<Badge size="lg" variant="tertiary">{entry.status.toUpperCase()}</Badge>
				{/if}
			{/if}
		</div>
		<a href={`/entries?category=${entry.category.id}`}>
			<h2
				id="entry-header-category"
				class="text-xl text-secondary transition-colors hover:text-tertiary"
			>
				{entry.category.name}
			</h2>
		</a>
	</div>

	<!-- Author info -->
	<div class="flex w-full items-center justify-between">
		<a id="entry-author" href={`/users/${entry.user?.username}`} class="flex items-center gap-4">
			<Avatar
				src={entry.user?.avatar?.url ?? ''}
				username={entry.user?.username ?? 'Unknown'}
				class="h-12 w-12"
			/>
			<div class="flex flex-col">
				<h3 class="text-lg font-bold">{entry.user?.username}</h3>
				<span class="text-sm text-shade-300">
					{formatRelativeTime(entry.createdAt)}
				</span>
			</div>
		</a>
		<div id="entry-header-actions" class="flex items-center gap-3">
			<!-- 
                <Button variant="outline" size="icon" title="React">
                    <SmilePlusIcon />
                </Button>
            -->

			{#if user?.username === entry.user?.username}
				<DeleteButton {user} {entry} />
			{:else}
				<VoteButton isSignedIn={user != null} id={entry.id} bind:isVoted />
			{/if}
		</div>
	</div>
</section>
