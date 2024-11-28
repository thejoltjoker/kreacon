<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import { user } from '$lib/stores/user';
</script>

{#if $user}
	<section>
		<!-- TODO Set default picture in db -->
		<Avatar src={$user.picture ?? ''} alt={$user.username ?? 'User avatar'} />
		<div class="flex flex-col">
			<p class="text-xl font-bold">{$user.username}</p>
			<p class="text-muted-foreground text-sm">
				Member since {$user.createdAt.toLocaleDateString()}
			</p>
		</div>
	</section>
{/if}

<style lang="postcss">
	section {
		@apply flex items-center gap-sm;
	}
</style>
