<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { PageData } from './$types';
	import { _ } from 'svelte-i18n';

	let { data }: { data: PageData } = $props();
	const { tickets } = data;
</script>

<div class="flex w-full flex-col gap-sm">
	<div class="flex flex-row items-center justify-between">
		<h1>{$_('tickets', { default: 'Tickets' })}</h1>
		<Button>Add ticket</Button>
	</div>

	{#if tickets.length === 0}
		<p>{$_('no_tickets_yet', { default: "You haven't added any tickets yet" })}</p>
	{:else}
		<ul>
			{#each tickets as ticket}
				<li>{ticket.content}</li>
			{/each}
		</ul>
	{/if}
</div>
