<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Dialog, type WithoutChild } from 'bits-ui';
	import { Separator } from 'bits-ui';
	import { XIcon } from 'lucide-svelte';

	interface Props extends Dialog.RootProps {
		buttonText: string;
		title: Snippet;
		description: Snippet;
		trigger: Snippet;
		contentProps?: WithoutChild<Dialog.ContentProps>;
	}

	let {
		open = $bindable(false),
		children,
		buttonText,
		contentProps,
		title,
		description,
		trigger,
		...restProps
	}: Props = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Trigger>
		{@render trigger()}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>
		<Dialog.Content
			{...contentProps}
			class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] border p-5 outline-none sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
			>
				{@render title()}
			</Dialog.Title>
			<Separator.Root class="bg-muted -mx-5 mb-6 mt-5 block h-px" />
			<Dialog.Description class="text-foreground-alt text-sm">
				{@render description()}
			</Dialog.Description>
			{@render children?.()}
			<Dialog.Close
				class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute right-5 top-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-98"
			>
				<div>
					<XIcon class="text-foreground size-5" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
