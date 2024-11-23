<script lang="ts">
	import type { LayoutData } from '../$types';

	let { user }: { user: LayoutData['user'] } = $props();
	import Avatar from '$lib/components/Avatar.svelte';
</script>

{#if user}
	<section>
		<!-- TODO Set default picture in db -->
		<Avatar src={user.picture ?? ''} alt={user.username ?? 'User avatar'} />
		<div class="flex flex-col">
			<p class="text-xl font-bold">{user.username}</p>
			<p class="text-sm text-zinc-500">Member since {user.createdAt.toLocaleDateString()}</p>
		</div>
	</section>
{/if}

<style lang="postcss">
	section {
		@apply flex items-center gap-sm;
	}
</style>
