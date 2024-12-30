<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import DumbDialog from '$lib/components/DumbDialog.svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import { t } from '$lib/i18n';
	import { TrashIcon } from 'lucide-svelte';

	let { eventId = $bindable() }: { eventId: number } = $props();

	let dialogOpen = $state(false);
	let sanityCheck = $state('');
</script>

{#snippet confirmLabel()}
	<p class="text-shade-300-alt text-base font-bold">
		Write "<span class="select-none text-white">heck yeah</span>" below to confirm.
	</p>
{/snippet}

<DumbDialog title="Delete event" bind:open={dialogOpen}>
	{#snippet trigger()}
		<Button
			variant="outline"
			size="icon"
			class="border-destructive hover:bg-destructive/20 hover:text-destructive"
		>
			<TrashIcon />
		</Button>
	{/snippet}

	{#snippet description()}
		<form method="POST" action="/admin/events?/delete" class="flex flex-col gap-xl" use:enhance>
			<input type="hidden" bind:value={eventId} name="eventId" />
			<p>
				{$t(
					'Are you sure you want to delete this event and all related categories, tickets and votes?'
				)}
			</p>
			<p class="font-bold tracking-wide text-destructive">{$t('This action cannot be undone!')}</p>
			<Divider variant="invisible" />
			<div class="flex w-full items-end justify-between gap-sm">
				<DumbInput
					type="text"
					name="sanityCheck"
					placeholder="Enter confirmation"
					label={confirmLabel}
					onpaste={(e) => e.preventDefault()}
					bind:value={sanityCheck}
					required
				/>

				<Button type="submit" variant="destructive" disabled={sanityCheck !== 'heck yeah'}>
					{$t('Delete')}
				</Button>
			</div>
		</form>
	{/snippet}
</DumbDialog>
