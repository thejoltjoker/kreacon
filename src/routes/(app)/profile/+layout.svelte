<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Sidebar from './_components/Sidebar.svelte';
	import ProfileHeader from './_components/ProfileHeader.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const { user } = data;
</script>

<div class="mx-auto flex max-w-screen-md flex-col gap-sm">
	<ProfileHeader {user} />
	<div class="flex flex-row gap-sm">
		<Sidebar />

		<main>
			{@render children()}
		</main>
	</div>
</div>

<style lang="postcss">
	main {
		@apply flex flex-1 flex-col items-center;
	}
</style>
