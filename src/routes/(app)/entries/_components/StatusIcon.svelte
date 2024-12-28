<script lang="ts">
	import Tooltip from '$lib/components/Tooltip.svelte';
	import type { EntryStatus } from '$lib/types/entryStatus';
	import { cn } from '$lib/utils';

	import { CircleDashedIcon, CircleDotIcon } from 'lucide-svelte';

	let { status }: { status?: EntryStatus } = $props();
	const border = cn(
		status === 'draft' && 'border border-secondary',
		status === 'published' && 'border border-success',
		status === 'rejected' && 'border border-destructive',
		status === 'pending' && 'border border-primary'
	);
	const className = cn(
		'flex size-form items-center justify-center bg-black/75 rounded-full',
		border,
		status === 'draft' && 'text-secondary',
		status === 'published' && 'text-success',
		status === 'rejected' && 'text-destructive',
		status === 'pending' && 'text-primary'
	);
</script>

<Tooltip tooltipClassName={border}>
	{#snippet trigger()}
		<div class={className}>
			{#if status === 'draft'}
				<CircleDashedIcon />
			{:else if status === 'pending'}
				<CircleDotIcon />
			{/if}
		</div>
	{/snippet}
	<span class="font-bold uppercase">
		{status}
	</span>
</Tooltip>
