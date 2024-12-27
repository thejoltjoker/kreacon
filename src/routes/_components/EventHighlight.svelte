<script lang="ts">
	import { ArrowRightIcon } from 'lucide-svelte';

	let {
		name,
		href,
		status
	}: { name: string; href: string; status: 'scheduled' | 'submitting' | 'voting' } = $props();

	const statusText = {
		scheduled: 'Coming up',
		submitting: 'Open for submissions',
		voting: 'Open for voting'
	};
</script>

<a
	{href}
	class="group inline-flex w-fit items-center gap-3 rounded-full border px-2xs py-2xs text-sm font-bold transition-colors hover:bg-white hover:text-black"
>
	<div
		class="focus:ring-ring inline-flex items-center rounded-full border border-transparent bg-white px-xs py-3xs text-xs font-bold uppercase text-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
	>
		{statusText[status]}
	</div>
	{name}
	<span class="flex size-5 items-center justify-center">
		<ArrowRightIcon class="size-5" />
	</span>
</a>
