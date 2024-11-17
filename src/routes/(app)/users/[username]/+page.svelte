<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const { user } = data ?? null;
</script>

<div>
	<h1>{user?.username}</h1>
</div>
