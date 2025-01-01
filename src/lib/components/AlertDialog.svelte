<script lang="ts">
	import type { Snippet } from 'svelte';
	import { AlertDialog, type WithoutChild } from 'bits-ui';
	import { XIcon } from 'lucide-svelte';
	import Divider from './Divider.svelte';
	import Button from './Button.svelte';

	type Props = AlertDialog.RootProps & {
		trigger?: Snippet;
		title: Snippet;
		description: Snippet;
		contentProps?: WithoutChild<AlertDialog.ContentProps>;
		onConfirm: () => void;
		onCancel?: () => void;
		variant?: 'default' | 'destructive';
		confirmText?: string;
	};

	let {
		open = $bindable(false),
		trigger,
		children,
		contentProps,
		title,
		description,
		onConfirm,
		onCancel,
		variant = 'default',
		confirmText = 'Confirm',
		...restProps
	}: Props = $props();
</script>

<AlertDialog.Root bind:open {...restProps}>
	{#if trigger}
		<AlertDialog.Trigger>
			{@render trigger()}
		</AlertDialog.Trigger>
	{/if}
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<AlertDialog.Content
			{...contentProps}
			class="fixed left-1/2 top-1/2 z-50 w-full max-w-dialog -translate-x-1/2 -translate-y-1/2 rounded-md border border-divider bg-bg shadow-sm outline-none"
		>
			<section class="dialog-header relative w-full px-xl py-xl pr-sm">
				<AlertDialog.Title class="w-full text-left text-lg font-bold">
					{@render title()}
				</AlertDialog.Title>
				<AlertDialog.Cancel
					class="absolute right-xl top-1/2 -mr-2xs ml-auto flex -translate-y-1/2 rounded-full p-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
				>
					<XIcon class="size-5" />
					<span class="sr-only">Close</span>
				</AlertDialog.Cancel>
			</section>
			<Divider />

			<AlertDialog.Description class="px-xl pt-xl">
				{@render description()}
			</AlertDialog.Description>

			{@render children?.()}
			<div class="flex justify-end gap-sm p-xl">
				<AlertDialog.Cancel>
					{#snippet child({ props })}
						<Button variant="muted" {...props} onclick={onCancel}>Cancel</Button>
					{/snippet}
				</AlertDialog.Cancel>
				<AlertDialog.Action>
					{#snippet child({ props })}
						<Button {variant} {...props} onclick={onConfirm}>{confirmText}</Button>
					{/snippet}
				</AlertDialog.Action>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
