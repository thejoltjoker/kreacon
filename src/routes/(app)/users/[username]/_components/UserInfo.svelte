<script lang="ts">
	import type { User } from '$lib/types/user';

	let { user }: { user: User } = $props();
</script>

<div>
	<h1>{user.username}</h1>
</div>
