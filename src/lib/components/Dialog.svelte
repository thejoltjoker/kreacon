<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Dialog, type WithoutChild } from 'bits-ui';

	type Props = Dialog.RootProps & {
		buttonText: string;
		title: Snippet;
		description: Snippet;
		contentProps?: WithoutChild<Dialog.ContentProps>;
	};

	let {
		open = $bindable(true),
		children,
		buttonText,
		contentProps,
		title,
		description,
		...restProps
	}: Props = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Trigger
		class="focus-visible:ring-offset-background rounded-form bg-muted-background focus-visible:ring-muted-foreground inline-flex h-12 items-center justify-center px-[21px] text-[15px] font-semibold whitespace-nowrap shadow-sm transition-colors hover:bg-black/95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-98"
	>
		{buttonText}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-30 bg-black/80"
		/>
		<Dialog.Content
			class="bg-bg p-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-1/2 left-1/2 z-30 w-full max-w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-lg border shadow-lg outline-none sm:max-w-[490px] md:w-full"
			{...contentProps}
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
			>
				{@render title()}
			</Dialog.Title>
			<Dialog.Description class="text-muted-foreground-alt text-sm">
				{@render description()}
			</Dialog.Description>
			{@render children?.()}
			<Dialog.Close
				class="focus-visible:ring-offset-background focus-visible:ring-muted-foreground absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-98"
			>
				<div>
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
