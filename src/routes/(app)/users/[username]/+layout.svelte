<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Select from '$lib/components/Select.svelte';
	import { Tabs } from 'bits-ui';
	import Avatar from '$lib/components/Avatar.svelte';
	import Tab from '$lib/components/Tab.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { user } = data;
	const { submissions, tickets, votes, reactions } = user ?? {};
	const events = tickets?.map((ticket) => ticket.event);
	const sortBy = [
		{ value: 'latest', label: 'Latest' },
		{ value: 'oldest', label: 'Oldest' }
	];
	let currentTab = $state('submissions');
</script>

<!-- Profile Header Section -->
<Tabs.Root controlledValue value={currentTab} onValueChange={(v) => (currentTab = v)}>
	<div class="mx-auto max-w-7xl px-4 py-8">
		<div class="flex items-start gap-6">
			<!-- Avatar and Info -->
			<div class="flex-1">
				<div class="flex items-center gap-6">
					<Avatar src={user?.picture ?? ''} alt="Profile" size="lg" />
					<div>
						<h1 class="text-2xl font-bold">{user?.username}</h1>
						<h2 class="mt-2 text-xl font-semibold">User bio not available</h2>

						<!-- Stats -->
						<div class="mt-4 flex gap-6 text-gray-600">
							<span>{user?.tickets?.length} events</span>
							<span>{user?.submissions?.length} submissions</span>
							<!-- <span>{user?.votes?.length} votes</span> -->
						</div>
					</div>
				</div>

				<!-- Action Buttons
				<div class="mt-6 flex gap-3">
					<button class="rounded-full bg-black px-4 py-2 text-white"> Get in touch </button>
					<button class="rounded-full border border-gray-300 px-4 py-2"> Following </button>
					<button class="rounded-full border border-gray-300 p-2">
						<span class="sr-only">More options</span>
						•••
					</button>
				</div> -->
			</div>
		</div>

		<!-- Navigation -->
		<nav class="mt-12">
			<Tabs.List class="border-muted-background flex items-center justify-between border-b pb-sm">
				<div class="flex gap-8">
					<Tab value="submissions" label="Submissions" />
					<Tab value="events" label="Events" />
					<Tab value="votes" label="Votes" />
					<Tab value="reactions" label="Reactions" />
				</div>
				<div>
					<Select items={sortBy} label="Sort by" />
				</div>
			</Tabs.List>
		</nav>

		<Tabs.Content value="submissions">
			{#if submissions != null}
				<!-- Gallery Grid -->
				<div class="w-full">
					<div class="grid grid-cols-3 gap-6">
						{#each submissions as submission}
							<div class="overflow-hidden rounded-2xl">
								<img src={submission.media.url} alt={submission.title} class="h-auto w-full" />
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div>
					<p>User has no submissions yet.</p>
				</div>
			{/if}
		</Tabs.Content>
		<Tabs.Content value="events">
			{#if events != null && events.length > 0}
				<ul>
					{#each events as event}
						<li>{event?.name}</li>
					{/each}
				</ul>
			{:else}
				<div>
					<p>User has no events yet.</p>
				</div>
			{/if}
		</Tabs.Content>
		<Tabs.Content value="votes">
			{#if votes != null && votes.length > 0}
				<ul>
					{#each votes as vote}
						<li>{vote?.submission?.title}</li>
					{/each}
				</ul>
			{:else}
				<div>
					<p>User hasn't voted on any submissions yet.</p>
				</div>
			{/if}
		</Tabs.Content>
		<Tabs.Content value="reactions">
			{#if reactions != null && reactions.length > 0}
				<ul>
					{#each reactions as reaction}
						<li>{reaction?.submission?.title}</li>
					{/each}
				</ul>
			{:else}
				<div>
					<p>User hasn't reacted to any submissions yet.</p>
				</div>
			{/if}
		</Tabs.Content>
	</div>
</Tabs.Root>
{@render children()}
