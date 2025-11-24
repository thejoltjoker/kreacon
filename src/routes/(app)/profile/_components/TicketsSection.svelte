<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { CheckCircle2Icon, PlusIcon } from 'lucide-svelte';
	import type { PageData } from '../$types';
	import TicketDialog from './TicketDialog.svelte';
	let {
		tickets,
		form
	}: {
		tickets: PageData['tickets'];
		form: PageData['ticketForm'];
	} = $props();
	let adding = $state(false);
</script>

<div class="gap-sm flex w-full flex-col">
	<div class="flex items-center justify-between">
		<h2>Tickets</h2>
		<Button variant="outline" icon={PlusIcon} onclick={() => (adding = true)}>Add ticket</Button>
	</div>

	{#if tickets.length === 0}
		<p>You haven't added any tickets yet</p>
	{:else}
		<ul class="gap-sm flex flex-col">
			{#each tickets as ticket (ticket.id)}
				<li
					class="gap-sm border-muted-background p-md flex flex-wrap items-center justify-start rounded-md border"
				>
					<p class="order-1 text-lg font-bold">{ticket.event?.name}</p>
					<div class="order-2 size-5 sm:order-3 sm:ml-auto">
						<CheckCircle2Icon class="text-success size-5" />
					</div>
					<p
						class="text-shade-300-alt order-3 w-full font-mono text-sm whitespace-pre sm:order-2 sm:w-auto"
					>
						{ticket.id}
					</p>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<TicketDialog bind:isOpen={adding} {form} />
