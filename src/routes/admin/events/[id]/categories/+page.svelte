<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<ul class="flex flex-col gap-sm">
	{#each data.categories as category}
		<li>{category.name}</li>
	{/each}
</ul>
