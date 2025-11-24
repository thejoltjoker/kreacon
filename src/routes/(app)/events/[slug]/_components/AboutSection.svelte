<script lang="ts">
	import { type PageData } from '../$types';

	let { event }: { event: PageData['event'] } = $props();
</script>

<section class="gap-sm flex w-full flex-col">
	<div class="flex flex-wrap items-center justify-between">
		<h2 class="text-h2 font-bold">About {event.name}</h2>
		<div class="pill border-shade-700 px-md py-3xs text-shade-300 w-fit rounded-full border">
			{event.participants} participants
		</div>
	</div>
	<p class="mb-lg w-full text-left">
		{event.description}
	</p>
</section>
