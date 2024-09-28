<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const users = data.users ?? [];
</script>

<div>
	<ul>
		{#each users as user}
			<li>{user.email}</li>
		{/each}
	</ul>
</div>
