<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<ul>
	{#each data.events as event}
		<li>{event.name}</li>
	{/each}
</ul>
