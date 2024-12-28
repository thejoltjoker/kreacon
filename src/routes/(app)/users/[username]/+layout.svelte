<script lang="ts">
	import { page } from '$app/stores';
	import HorizontalMenu from '$lib/components/HorizontalMenu.svelte';
	import HorizontalMenuItem from '$lib/components/HorizontalMenuItem.svelte';
	import type { Snippet } from 'svelte';
	import SortBySelect from '../../_components/SortBySelect.svelte';
	import type { LayoutData } from './$types';
	import UserInfo from './_components/UserInfo.svelte';
	import { t } from '$lib/i18n';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const sortByItems: {
		value: string;
		label: string;
		disabled?: boolean;
	}[] = [
		{ label: $t('Newest'), value: 'newest' },
		{ label: $t('Oldest'), value: 'oldest' },
		{ label: $t('Random'), value: 'random' }
	];

	let defaultSortBy = 'newest';
</script>

<!-- Profile Header Section -->
<div class="flex w-full max-w-screen-lg flex-col gap-xl p-sm md:p-xl">
	<div class="flex items-start gap-sm">
		<UserInfo user={data.profileUser} />
	</div>

	<!-- Navigation -->
	<nav class="mt-sm md:mt-xl">
		<HorizontalMenu>
			<HorizontalMenuItem
				href="/users/{data.profileUser.username}/entries?sortBy={$page.url.searchParams.get(
					'sortBy'
				) ?? defaultSortBy}"
			>
				{$t('Entries')}
			</HorizontalMenuItem>
			<HorizontalMenuItem
				href="/users/{data.profileUser.username}/reactions?sortBy={$page.url.searchParams.get(
					'sortBy'
				) ?? defaultSortBy}"
			>
				{$t('Reactions')}
			</HorizontalMenuItem>

			<div class="ml-auto">
				<SortBySelect items={sortByItems} />
			</div>
		</HorizontalMenu>
	</nav>

	{@render children()}
</div>
