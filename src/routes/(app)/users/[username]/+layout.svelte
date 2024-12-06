<script lang="ts">
	import HorizontalMenu from '$lib/components/HorizontalMenu.svelte';
	import HorizontalMenuItem from '$lib/components/HorizontalMenuItem.svelte';
	import type { Snippet } from 'svelte';
	import SortBySelect from '../../submissions/_components/SortBySelect.svelte';
	import type { LayoutData } from './$types';
	import UserInfo from './_components/UserInfo.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const sortByItems: {
		value: string;
		label: string;
		disabled?: boolean;
	}[] = [
		{ label: 'Newest', value: 'date_desc' },
		{ label: 'Oldest', value: 'date_asc' },
		{ label: 'Random', value: 'random' }
	];

	let currentTab = $state('submissions');
</script>

<!-- Profile Header Section -->
<div class="flex w-full max-w-screen-lg flex-col gap-xl p-sm md:p-xl">
	<div class="flex items-start gap-sm">
		<UserInfo user={data.profileUser} />
	</div>

	<!-- Navigation -->
	<nav class="mt-sm md:mt-xl">
		<HorizontalMenu>
			<HorizontalMenuItem href="/users/{data.profileUser.username}/submissions">
				Submissions
			</HorizontalMenuItem>
			<!-- <HorizontalMenuItem href="/users/{data.user.username}/events">Events</HorizontalMenuItem> -->
			<!-- <HorizontalMenuItem href="/users/{data.user.username}/votes">Votes</HorizontalMenuItem>
			<HorizontalMenuItem href="/users/{data.user.username}/reactions">
				Reactions
			</HorizontalMenuItem> -->

			<div class="ml-auto">
				<SortBySelect items={sortByItems} />
			</div>
		</HorizontalMenu>
	</nav>

	{@render children()}
</div>
