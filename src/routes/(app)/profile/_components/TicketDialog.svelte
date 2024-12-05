<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Dialog, Label, Separator } from 'bits-ui';
	import { TicketIcon, XIcon } from 'lucide-svelte';
	let { isOpen = $bindable() }: { isOpen: boolean } = $props();
	// TODO Change to isOpen
	// let open = $state(true);
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<Dialog.Content
			class="card fixed left-1/2 top-1/2 z-50 w-full max-w-[94%] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-muted-foreground bg-bg p-0 shadow-lg outline-none sm:max-w-screen-sm md:w-full"
		>
			<Dialog.Title
				class="flex h-form w-full flex-col items-center justify-center bg-muted-background font-bold"
			>
				Add ticket
			</Dialog.Title>
			<Separator.Root class="h-px bg-divider" />
			<div class="flex flex-col gap-xl p-xl">
				<Dialog.Description class="text-foreground-alt">
					Add a ticket to your profile. You should have received this in your email.
				</Dialog.Description>

				<Label.Root for="ticketId">
					Ticket number
					<div class="relative w-full">
						<input
							id="ticketId"
							class="input inline-flex h-form w-full items-center rounded-form border bg-bg px-4 text-sm"
							placeholder="Ticket number"
							name="ticketId"
						/>
						<TicketIcon
							class="absolute right-md top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
						/>
					</div>
				</Label.Root>
				<div class="flex w-full justify-end">
					<Dialog.Close>
						<Button>Save</Button>
					</Dialog.Close>
				</div>
			</div>
			<Dialog.Close
				class="focus-visible:ring-foreground absolute right-0 top-0 size-form rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-98"
			>
				<div class="flex items-center justify-center">
					<XIcon class="text-foreground size-5" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
