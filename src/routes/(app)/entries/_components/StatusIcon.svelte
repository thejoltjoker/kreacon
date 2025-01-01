<script lang="ts">
	import type { EntryStatus } from '$lib/types/entryStatus';
	import { cn } from '$lib/utils';

	let { status }: { status?: EntryStatus } = $props();
	const border = cn(
		status === 'draft' && 'border border-secondary',
		status === 'published' && 'border border-success',
		status === 'rejected' && 'border border-pomodoro-950',
		status === 'pending' && 'border border-sun-950'
	);
	const className = cn(
		'flex items-center justify-center bg-black/75 rounded-full uppercase font-bold text-sm px-xs py-3xs',
		border,
		status === 'draft' && 'text-secondary',
		status === 'published' && 'text-success',
		status === 'rejected' && 'text-pomodoro-950 bg-pomodoro-500',
		status === 'pending' && 'text-sun-950 bg-sun-400'
	);
</script>

<div class={className}>
	{status}
</div>
