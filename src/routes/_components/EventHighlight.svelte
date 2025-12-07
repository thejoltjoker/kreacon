<script lang="ts">
	import type { EventStatus } from '$lib/helpers/eventStatus';
	import { ArrowRightIcon } from 'lucide-svelte';

	let { name, href, status }: { name: string; href: string; status: EventStatus } = $props();

	const statusText = {
		scheduled: 'Coming up',
		submitting: 'Open for submissions',
		voting: 'Open for voting',
		closed: 'Closed'
	};
</script>

<a
	{href}
	class="group px-2xs py-2xs inline-flex w-fit items-center gap-3 rounded-full border text-sm font-bold transition-colors hover:bg-white hover:text-black"
>
	<div
		class="focus:ring-ring px-xs py-3xs inline-flex items-center rounded-full border border-transparent bg-white text-xs font-bold text-black uppercase transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
	>
		{statusText[status]}
	</div>
	{name}
	<span class="flex size-5 items-center justify-center">
		<ArrowRightIcon class="size-5" />
	</span>
</a>
