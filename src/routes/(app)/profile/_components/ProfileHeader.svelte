<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import { page } from '$app/stores';

	const user = $derived($page.data.user);
</script>

{#if user}
	<section>
		<!-- TODO Set default picture in db -->
		<Avatar src={user.avatar?.url ?? ''} username={user.username} />
		<div class="flex flex-col">
			<p class="text-xl font-bold">{user.username}</p>
			<p class="text-shade-300 text-sm">
				Member since {user.createdAt.toLocaleDateString()}
			</p>
		</div>
	</section>
{/if}

<style lang="postcss">
	@reference "../../../../app.css";

	section {
		@apply gap-sm flex items-center;
	}
</style>
