<script lang="ts">
	import type { PageData } from '../$types';

	let { event }: { event: PageData['event'] } = $props();
</script>

<header class="flex w-full flex-col items-center justify-center gap-xl px-sm py-xl">
	<h1 class="text-center text-4xl font-bold md:text-5xl">
		{event.name}
	</h1>
	<p class="text-center text-xl text-shade-300 text-balance">
		{event.tagline}
	</p>
</header>
