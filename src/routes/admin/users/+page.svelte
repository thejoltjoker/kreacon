<script lang="ts">
	import type { User } from '$lib/server/db/schema';
	import type { LayoutData, PageData } from '../(entity)/$types';

	export let data: LayoutData;
	const users = data.users ?? [];
</script>

<div>
	<ul>
		{#each users as user}
			<li>{user.email}</li>
		{/each}
	</ul>
</div>
