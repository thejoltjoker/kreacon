<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Dialog, Label, Separator } from 'bits-ui';
	import { TicketIcon, XIcon } from 'lucide-svelte';
	let { isOpen = $bindable() }: { isOpen: boolean } = $props();
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>
		<Dialog.Content
			class="rounded-card-lg shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] border bg-bg p-5 outline-none sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
			>
				Add ticket
			</Dialog.Title>
			<Separator.Root class="bg-muted -mx-5 mb-6 mt-5 block h-px" />
			<Dialog.Description class="text-foreground-alt text-sm">
				Add a ticket to your profile. You should have received this in your email.
			</Dialog.Description>
			<div class="flex flex-col items-start gap-1 pb-11 pt-7">
				<Label.Root for="ticketId" class="text-sm font-medium">Ticket number</Label.Root>
				<div class="relative w-full">
					<input
						id="apiKey"
						class="placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-foreground inline-flex h-form w-full items-center rounded-form border border bg-bg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg"
						placeholder="secret_api_key"
						name="name"
					/>
					<TicketIcon class="text-dark/30 absolute right-4 top-[14px] size-[22px]" />
				</div>
			</div>
			<div class="flex w-full justify-end">
				<Dialog.Close
					class="bg-dark  hover:bg-dark/95 focus-visible:ring-dark inline-flex h-form items-center justify-center rounded-form px-[50px] text-[15px] font-semibold text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-98"
				>
					<Button>Save</Button>
				</Dialog.Close>
			</div>
			<Dialog.Close
				class="focus-visible:ring-foreground absolute right-5 top-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-98"
			>
				<div>
					<XIcon class="text-foreground size-5" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
