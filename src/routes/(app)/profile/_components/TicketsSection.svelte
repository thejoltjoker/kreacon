<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { CheckCircle2Icon, CheckCircleIcon, CopyIcon, PlusIcon, XIcon } from 'lucide-svelte';
	import type { PageData } from '../$types';
	import TicketDialog from './TicketDialog.svelte';

	let { tickets }: { tickets: PageData['tickets'] } = $props();
	let adding = $state(false);
</script>

<div class="flex w-full flex-col gap-sm">
	<div class="flex items-center justify-between">
		<h3>Tickets</h3>
		<Button variant="outline" icon={PlusIcon} onclick={() => (adding = true)}>Add ticket</Button>
	</div>

	{#if tickets.length === 0}
		<p>You haven't added any tickets yet</p>
	{:else}
		<ul class="flex flex-col gap-sm">
			{#each tickets as ticket}
				<li
					class="flex flex-wrap items-center justify-start gap-sm rounded-md border border-muted-background p-md"
				>
					<p class="order-1 text-lg font-bold">{ticket.event?.name}</p>
					<div class="order-2 size-5 sm:order-3 sm:ml-auto">
						<CheckCircle2Icon class="size-5 text-success" />
					</div>
					<p
						class="order-3 w-full whitespace-pre font-mono text-sm text-muted-foreground-alt sm:order-2 sm:w-auto"
					>
						{ticket.id}
					</p>
				</li>
			{/each}
		</ul>
	{/if}
</div>
<TicketDialog bind:isOpen={adding} />
