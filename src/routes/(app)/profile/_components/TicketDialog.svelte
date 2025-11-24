<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import { Dialog, Separator } from 'bits-ui';
	import { TicketIcon, XIcon } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from '../$types';

	interface Props {
		isOpen: boolean;
		form: PageData['ticketForm'];
	}
	let { isOpen = $bindable(), form }: Props = $props();

	const {
		form: ticketForm,
		errors: ticketErrors,
		enhance: ticketEnhance,
		message: ticketMessage
	} = superForm(form, {
		resetForm: true,
		invalidateAll: true
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<Dialog.Content
			class="card border-muted-foreground bg-bg fixed top-1/2 left-1/2 z-50 w-full max-w-[94%] -translate-x-1/2 -translate-y-1/2 overflow-hidden border p-0 shadow-lg outline-none sm:max-w-(--breakpoint-sm) md:w-full"
		>
			<form method="POST" action="?/addTicket" use:ticketEnhance>
				<Dialog.Title
					class="h-form bg-muted-background flex w-full flex-col items-center justify-center font-bold"
				>
					Add ticket
				</Dialog.Title>
				<Separator.Root class="bg-divider h-px" />

				<div class="gap-xl p-xl flex flex-col">
					<Dialog.Description class="text-foreground-alt">
						Add a ticket to your profile. You should have received this in your email.
					</Dialog.Description>

					<DumbInput
						icon={TicketIcon}
						placeholder="Ticket number"
						label="Ticket ID"
						id="ticket-id"
						name="id"
						bind:value={$ticketForm.id}
						errors={$ticketErrors.id}
					/>
					{#if $ticketMessage?.status === 'error'}
						<p class="text-error">{$ticketMessage.text}</p>
					{:else if $ticketMessage?.status === 'success'}
						<p class="text-success">{$ticketMessage.text}</p>
					{/if}

					<div class="flex w-full justify-end">
						{#if $ticketMessage?.status === 'success'}
							<Dialog.Close>
								<Button type="button" variant="outline">Close</Button>
							</Dialog.Close>
						{:else}
							<Button type="submit">Add ticket</Button>
						{/if}
					</div>
				</div>
				<Dialog.Close
					class="focus-visible:ring-foreground size-form focus-visible:ring-offset-bg absolute top-0 right-0 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-98"
				>
					<div class="flex items-center justify-center">
						<XIcon class="text-foreground size-5" />
						<span class="sr-only">Close</span>
					</div>
				</Dialog.Close>
			</form>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
