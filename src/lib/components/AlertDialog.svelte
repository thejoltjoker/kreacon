<script lang="ts">
	import type { Snippet } from 'svelte';
	import { AlertDialog, type WithoutChild } from 'bits-ui';
	import { XIcon } from 'lucide-svelte';
	import Divider from './Divider.svelte';
	import Button from './Button.svelte';

	type Props = AlertDialog.RootProps & {
		trigger?: Snippet<[{ props: Record<string, unknown> }]>;
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
			{#snippet child({ props })}
				{@render trigger({ props })}
			{/snippet}
		</AlertDialog.Trigger>
	{/if}
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<AlertDialog.Content
			{...contentProps}
			class="max-w-dialog border-divider bg-bg fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-md border shadow-sm outline-none"
		>
			<section class="dialog-header px-xl py-xl pr-sm relative w-full">
				<AlertDialog.Title class="w-full text-left text-lg font-bold">
					{@render title()}
				</AlertDialog.Title>
				<AlertDialog.Cancel
					class="right-xl -mr-2xs p-2xs focus-visible:ring-muted-foreground focus-visible:ring-offset-bg absolute top-1/2 ml-auto flex -translate-y-1/2 rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
			<div class="gap-sm p-xl flex justify-end">
				<AlertDialog.Cancel>
					{#snippet child({ props })}
						<Button
							variant="muted"
							{...props}
							onclick={(e) => {
								onCancel?.();
								(props.onclick as ((e: MouseEvent) => void) | undefined)?.(e);
							}}
						>
							Cancel
						</Button>
					{/snippet}
				</AlertDialog.Cancel>
				<AlertDialog.Action>
					{#snippet child({ props })}
						<Button
							{variant}
							{...props}
							onclick={(e) => {
								onConfirm();
								(props.onclick as ((e: MouseEvent) => void) | undefined)?.(e);
							}}
						>
							{confirmText}
						</Button>
					{/snippet}
				</AlertDialog.Action>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
