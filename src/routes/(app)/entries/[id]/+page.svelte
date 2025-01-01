<script lang="ts">
	import { page } from '$app/stores';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import ReactionsSection from './_components/ReactionsSection.svelte';
	import VoteButton from './_components/VoteButton.svelte';
	import { t } from '$lib/i18n';
	import { getMediaTypeForMime } from '$lib/helpers/mediaTypes';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import { formatRelativeTime } from '$lib/helpers/formatRelativeTime';
	import { DownloadIcon, TrashIcon } from 'lucide-svelte';
	import { type PageData } from './$types';
	import Badge from '$lib/components/Badge.svelte';
	import LicenseTooltip from '$lib/components/LicenseTooltip.svelte';
	import AlertDialog from '$lib/components/AlertDialog.svelte';

	const user = $derived($page.data.user);

	let { data }: { data: PageData } = $props();
	let isVoted = $state(data.isVoted ?? false);
	let entry = $derived(data.entry);
	let entryId = $derived($page.params.id);
	let isOwner = $derived(user?.username === entry?.user?.username);
	let deleteFormRef = $state<HTMLFormElement | null>(null);
	// let isAllowedToReact: boolean = $state(
	// 	entry?.reactions.find((reaction) => reaction.userId === user?.id) == null
	// );

	const handleDelete = () => {
		if (user?.username != entry?.user?.username) {
			throw new Error('Unauthorized to delete this entry');
		}
		deleteFormRef?.submit();
	};
</script>

<!-- TODO Show license -->
{#if entry != null}
	<main class="flex w-full max-w-screen-lg flex-col gap-sm px-sm pt-sm md:gap-xl md:px-xl md:pt-xl">
		<!-- Header -->
		<div class="flex flex-wrap items-center justify-between gap-xs">
			<div class="inline-flex items-center gap-xs">
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
				<h2 class="text-xl text-secondary transition-colors hover:text-tertiary">
					{entry.category.name}
				</h2>
			</a>
		</div>

		<!-- Author info -->
		<div class="flex w-full items-center justify-between">
			<a href={`/users/${entry.user?.username}`} class="flex items-center gap-4">
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
			<div class="flex items-center gap-3">
				<!-- TODO Match style of reactions to that of user page -->
				<!-- TODO Allow user to change reaction -->
				<!-- <Popover.Root>
					<Popover.Trigger>
						<Button variant="outline" size="icon" title="React">
							<SmilePlusIcon />
						</Button>
					</Popover.Trigger>
					<Popover.Content
						class="z-30 max-h-[320px] w-fit max-w-[320px] overflow-hidden overflow-y-auto rounded-lg bg-shade-800 p-sm"
						sideOffset={5}
					>
						{#if user == null}
							<p>You must be logged in to share your reaction.</p>
							<Button href="/login?redirect=/entries/{entryId}">Log in</Button>
						{:else if !isAllowedToReact}
							<p>You already reacted to this entry.</p>
						{:else}
							<form method="POST" action="?/react">
								<div class="flex flex-wrap gap-xs">
									{#each emojis as emoji}
										<Button type="submit" name="reaction" value={emoji} variant="ghost" size="icon">
											{emoji}
										</Button>
									{/each}
								</div>
							</form>
						{/if}
					</Popover.Content>
				</Popover.Root> -->

				{#if user?.username === entry.user?.username}
					<form method="POST" action="?/delete" bind:this={deleteFormRef}>
						<AlertDialog variant="destructive" onConfirm={handleDelete}>
							{#snippet title()}
								<h2>Delete entry</h2>
							{/snippet}
							{#snippet description()}
								<p>
									Are you sure you want to delete this entry?
									<br />
									<span class="text-destructive">This action cannot be undone!</span>
								</p>
								<p class="pt-sm text-sm text-shade-300">
									Deleting this entry will allow you to submit a new one to the same category and
									event.
								</p>
							{/snippet}
							{#snippet trigger()}
								<Button type="submit" size="icon" variant="destructive"><TrashIcon /></Button>
							{/snippet}
						</AlertDialog>
					</form>
				{:else}
					<VoteButton isSignedIn={user != null} id={entryId} bind:isVoted />
				{/if}
			</div>
		</div>

		<!-- Media -->
		<div class="flex flex-col items-center">
			{#if entry.media}
				{@const mediaType = getMediaTypeForMime(entry.media.type)}
				{#if mediaType === 'image'}
					<img
						src={`${entry.media?.url}`}
						alt={entry.title}
						class="h-full w-full overflow-hidden rounded-form object-cover object-center"
					/>
				{:else if mediaType === 'video'}
					<VideoPlayer src={entry.media.url} poster={entry.preview?.url} />
				{:else if mediaType === 'audio'}
					<AudioPlayer src={entry.media.url} poster={entry.preview?.url} />
				{/if}
			{:else}
				<p>No media found</p>
			{/if}
		</div>

		<!-- Meta -->
		<div class="flex items-center justify-between gap-lg text-gray-500">
			<div class="flex flex-1 flex-wrap items-center gap-lg text-lg">
				<p><span class="text-white">{entry.views}</span> {$t('views')}</p>
				<p><span class="text-white">{entry.reactions.length}</span> {$t('reactions')}</p>
				<p class="inline-flex items-center gap-xs">
					<span class="text-white">{entry.license.toUpperCase()}</span>
					<LicenseTooltip license={entry.license} />
				</p>
			</div>

			<!-- Actions -->
			<div class="flex flex-1 justify-end gap-sm">
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
					<Button size="icon" variant="destructive"><TrashIcon /></Button>
				{:else}
					<VoteButton isSignedIn={user != null} id={entryId} bind:isVoted />
				{/if}
			</div>
		</div>

		<!-- Reactions -->
		<ReactionsSection reactions={entry?.reactions} />

		<!-- More work/related grid -->
		<!-- TODO -->
		<!-- <div>
		<div class=" flex items-center justify-between">
			<h3 class="font-bold">More by {data.user?.username}</h3>
			<a href="/" class="text-gray-500 hover:text-gray-700">View profile</a>
		</div>
		<div class="grid grid-cols-4 gap-4">
			{#each data.moreWork as work}
				<a href={work.url} class="block">
					<img
						src={work.image}
						alt={work.title}
						class="w-full rounded-lg transition-opacity hover:opacity-90"
					/>
				</a>
			{/each}
		</div>
	</div> -->
	</main>
{:else}
	<main class="flex h-full w-full items-center justify-center">
		<h2>{$t('Entry not found')}</h2>
	</main>
{/if}
