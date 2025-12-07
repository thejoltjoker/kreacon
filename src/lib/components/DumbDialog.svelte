<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Dialog, type WithoutChild } from 'bits-ui';
	import { XIcon } from 'lucide-svelte';
	import Divider from './Divider.svelte';

	interface Props extends Dialog.RootProps {
		title: string;
		description: Snippet;
		trigger?: Snippet;
		contentProps?: WithoutChild<Dialog.ContentProps>;
	}

	let {
		open = $bindable(false),
		contentProps,
		title,
		description,
		trigger,
		...restProps
	}: Props = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	{#if trigger}
		<Dialog.Trigger>
			{@render trigger()}
		</Dialog.Trigger>
	{/if}
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<Dialog.Content
			{...contentProps}
			class="max-w-dialog border-divider bg-bg fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-md border shadow-sm outline-none"
		>
			<section class="dialog-header px-xl py-xl pr-sm relative w-full">
				<Dialog.Title class=" w-full text-left text-lg font-bold">
					{title}
				</Dialog.Title>
				<Dialog.Close
					class="right-xl -mr-2xs p-2xs focus-visible:ring-muted-foreground focus-visible:ring-offset-bg absolute top-1/2 ml-auto flex -translate-y-1/2 rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					<XIcon class="size-5" />
					<span class="sr-only">Close</span>
				</Dialog.Close>
			</section>
			<Divider />

			<Dialog.Description class="p-xl">
				{@render description()}
			</Dialog.Description>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
