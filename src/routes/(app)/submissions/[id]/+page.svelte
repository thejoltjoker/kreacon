<script lang="ts">
	import { page } from '$app/stores';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import { emojis } from '$lib/emojis';
	import { Popover } from 'bits-ui';
	import { DownloadIcon, SmilePlusIcon } from 'lucide-svelte';
	import type { PageData } from './$types';
	import AudioPlayer from './_components/AudioPlayer.svelte';
	import ReactionButton from './_components/ReactionButton.svelte';
	import ReactionsSection from './_components/ReactionsSection.svelte';
	import SubmissionMedia from './_components/SubmissionMedia.svelte';
	import VoteButton from './_components/VoteButton.svelte';
	import { t } from '$lib/i18n';

	const user = $derived($page.data.user);

	let { data }: { data: PageData } = $props();
	const { submission } = data;

	const submissionId = $page.params.id;

	let isVoted = $state(data.isVoted ?? false);

	let isAllowedToReact: boolean = $state(
		submission?.reactions.find((reaction) => reaction.userId === user?.id) == null
	);
</script>

<main class="flex w-full max-w-screen-lg flex-col gap-lg p-sm">
	<!-- Header -->
	<div class="flex flex-wrap items-center justify-between gap-xs">
		<h1 class="text-2xl font-bold">{submission?.title}</h1>
		<a href={`/submissions?category=${submission?.category.id}`}>
			<h2 class="text-xl text-secondary hover:text-tertiary">
				{submission?.category.name}
			</h2>
		</a>
	</div>

	<!-- Author info -->
	<div class="flex w-full items-center justify-between">
		<a href={`/users/${submission?.user?.username}`} class="flex items-center gap-4">
			<Avatar
				src={submission?.user?.picture ?? ''}
				alt={submission?.user?.username ?? ''}
				class="h-12 w-12"
			/>
			<div class="flex flex-col">
				<h3 class="text-lg font-bold">{submission?.user?.username}</h3>
				<span class="text-sm text-muted-foreground">Submitted 2 days ago</span>
			</div>
		</a>
		<div class="flex items-center gap-3">
			<Popover.Root>
				<Popover.Trigger>
					<Button variant="outline" size="icon" title="React">
						<SmilePlusIcon />
					</Button>
				</Popover.Trigger>
				<Popover.Content
					class="z-30 max-h-[320px] w-fit max-w-[320px] overflow-hidden overflow-y-auto rounded-lg bg-muted-background p-sm"
					sideOffset={5}
				>
					{#if user == null}
						<p>You must be logged in to share your reaction.</p>
						<Button href="/login?redirect=/submissions/{submissionId}">Log in</Button>
					{:else if !isAllowedToReact}
						<p>You already reacted to this submission.</p>
					{:else}
						<!-- TODO Allow user to change reaction -->
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
			</Popover.Root>
			<VoteButton isSignedIn={user != null} id={submissionId} bind:isVoted />
		</div>
	</div>

	<!-- Media -->
	<div class="flex flex-col items-center">
		{#if submission?.media?.type === 'audio'}
			<AudioPlayer media={submission?.media} />
		{:else}
			<SubmissionMedia media={submission?.media} />
		{/if}
	</div>

	<!-- Meta -->
	<div class="flex items-center justify-between gap-lg text-sm text-gray-500">
		<div class="flex flex-1 items-center gap-lg text-lg">
			<p><span class="text-white">{submission?.views}</span> {$t('views')}</p>
			<p><span class="text-white">{submission?.reactions.length}</span> {$t('reactions')}</p>
		</div>
		<!-- Actions -->
		<div class="flex flex-1 justify-end gap-sm">
			<Button
				variant="outline"
				size="icon"
				href={submission?.media.url}
				download={submission?.media.filename ?? undefined}
			>
				<DownloadIcon />
			</Button>
			<!-- TODO share button
			<Button variant="outline" size="icon">
				<ShareIcon />
			</Button> -->
			<ReactionButton {submissionId} bind:isAllowedToReact />
			<VoteButton isSignedIn={user != null} id={submissionId} bind:isVoted />
		</div>
	</div>

	<!-- Reactions -->
	<ReactionsSection reactions={submission?.reactions} />

	<!-- Author profile -->
	<!-- TODO -->
	<!-- <div class=" text-center">
		<img
			src={data.user?.picture}
			alt={data.user?.username}
			class="mx-auto h-16 w-16 rounded-full"
		/>
		<h2 class=" font-bold">{data.user?.username}</h2>
		<button class="rounded-md bg-gray-900 px-4 py-2 text-white">Get in touch</button>
	</div> -->

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
