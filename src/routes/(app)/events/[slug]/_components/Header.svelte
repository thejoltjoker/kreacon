<script lang="ts">
	import type { PageData } from '../$types';

	let { event }: { event: PageData['event'] } = $props();
</script>

<header class="gap-xl px-sm py-xl flex w-full flex-col items-center justify-center">
	<h1 class="text-center text-4xl font-bold md:text-5xl">
		{event.name}
	</h1>
	<p class="text-shade-300 text-center text-xl text-balance">
		{event.tagline}
	</p>
</header>
