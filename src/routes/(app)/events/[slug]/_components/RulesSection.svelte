<script lang="ts">
	import type { PageData } from '../$types';

	let { event }: { event: PageData['event'] } = $props();
</script>

<section class="w-full">
	<h2 class="text-h2 font-bold">General Rules</h2>
	<ul class="text-shade-300 marker:text-primary list-inside list-disc">
		{#each event.rules as rule, index (index)}
			<li>
				{rule.text}
			</li>
		{/each}
	</ul>
</section>
