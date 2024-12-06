<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Dialog, type WithoutChild } from 'bits-ui';
	import { Separator } from 'bits-ui';
	import { XIcon } from 'lucide-svelte';
	import Button from './Button.svelte';
	import Divider from './Divider.svelte';

	interface Props extends Dialog.RootProps {
		title: string;
		content: Snippet;
		trigger: Snippet;
		contentProps?: WithoutChild<Dialog.ContentProps>;
	}

	let {
		open = $bindable(false),
		children,
		contentProps,
		title,
		content,
		trigger,

		...restProps
	}: Props = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Trigger>
		{@render trigger()}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<Dialog.Content
			{...contentProps}
			class="fixed left-1/2 top-1/2 z-50 w-full max-w-dialog -translate-x-1/2 -translate-y-1/2 rounded-md border border-divider bg-bg shadow-sm outline-none"
		>
			<section class="dialog-header relative w-full px-xl py-xl pr-sm">
				<Dialog.Title class=" w-full text-left text-lg font-bold">
					{title}
				</Dialog.Title>
				<Dialog.Close
					class="absolute right-xl top-1/2 -mr-2xs ml-auto flex -translate-y-1/2 rounded-full p-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
				>
					<XIcon class="size-5" />
					<span class="sr-only">Close</span>
				</Dialog.Close>
			</section>
			<Divider />

			<Dialog.Description class="p-xl">
				{@render content()}
			</Dialog.Description>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
