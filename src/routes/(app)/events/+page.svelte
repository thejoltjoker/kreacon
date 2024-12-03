<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<main class="flex w-full max-w-screen-lg flex-col gap-xl">
	{#each data.events as event}
		<a href="/events/{event.slug}">{event.name}</a>
	{/each}
</main>
