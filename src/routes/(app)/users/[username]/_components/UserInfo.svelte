<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import type { PublicUser } from '$lib/server/db/schema/user';
	import type { LayoutData } from '../$types';
	interface Props {
		user: LayoutData['profileUser'];
	}

	let { user }: Props = $props();
</script>

<div id="user-details" class="flex items-center gap-6">
	<Avatar src={user?.picture ?? ''} alt="Profile" size="lg" />
	<div>
		<h2 class="text-3xl font-bold">{user?.username}</h2>
		<p class="member-since text-muted-foreground">
			Member since {user?.createdAt
				.toLocaleDateString('en-US', {
					day: 'numeric',
					month: 'short',
					year: 'numeric'
				})
				.toLowerCase()}
		</p>

		<div class="user-stats mt-sm flex gap-6 text-muted-foreground-alt">
			<p><span class="text-white">{user?.ticketCount}</span> events</p>
			<p><span class="text-white">{user?.submissionCount}</span> submissions</p>
		</div>
	</div>
</div>
