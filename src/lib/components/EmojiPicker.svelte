<script lang="ts">
	import { Command, Dialog, type DialogTriggerPropsWithoutHTML } from 'bits-ui';
	import { groupedEmojis } from '$lib/emojis.svelte';
	import { ArrowBigDownIcon, ArrowBigUpIcon, InfoIcon } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import Divider from './Divider.svelte';
	import EmojiPickerItem from './EmojiPickerItem.svelte';

	let {
		trigger,
		triggerProps,
		handleSubmit,
		open = $bindable(false)
	}: {
		open?: boolean;
		trigger: Snippet<[DialogTriggerPropsWithoutHTML]>;
		triggerProps?: Omit<DialogTriggerPropsWithoutHTML, 'child'>;
		handleSubmit: (emoji: string) => void;
	} = $props();
	// let dialogOpen = $state(false);
	let value = $state('');

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSubmitReaction();
		}
	};
	const handleClick = (reaction: string) => {
		value = reaction;
		handleSubmitReaction();
		open = false;
	};

	const handleSubmitReaction = () => {
		handleSubmit(value);
		open = false;
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger {...triggerProps}>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="emoji-picker fixed left-1/2 top-1/2 z-50 w-full max-w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-form bg-bg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[500px]"
		>
			<Dialog.Title class="sr-only">Command Menu</Dialog.Title>
			<Dialog.Description class="sr-only">
				This is the emoji picker. Use the up and down arrow keys to navigate.
			</Dialog.Description>
			<Command.Root
				onkeydown={handleKeydown}
				bind:value
				class="flex h-full w-full flex-col self-start overflow-hidden rounded-form border border-shade-700 bg-bg p-sm"
			>
				<Command.Input
					class="disabled:bg-muted-backgrountitle mb-sm h-form rounded-form border-shade-600 bg-bg focus:border-violet-500 focus:ring-violet-500 focus:placeholder:text-shade-600 disabled:border-shade-400 disabled:text-shade-400 [&:read-only]:border-shade-400 [&:read-only]:bg-muted-background/50 [&:read-only]:text-shade-400 [&:user-invalid]:border-red-500 [&:user-invalid]:focus:border-red-500 [&:user-invalid]:focus:ring-red-500"
					placeholder="Express yourself..."
				/>
				<Command.List class="max-h-[280px] overflow-y-auto overflow-x-hidden">
					<Command.Viewport class="flex flex-col gap-sm pb-sm">
						<Command.Empty class="w-full p-sm text-sm text-shade-300">
							No results found.
						</Command.Empty>
						{#each groupedEmojis as group}
							{@const Icon = group.icon}
							<Command.Group>
								<Command.GroupHeading class="inline-flex items-center gap-xs pb-xs">
									<Icon class="size-4 text-white" />
									<p class="font-bold text-white">{group.title}</p>
								</Command.GroupHeading>
								<Command.GroupItems>
									<div class="grid grid-cols-emoji gap-2xs">
										{#each group.emojis as emoji}
											<EmojiPickerItem onclick={handleClick} {emoji} />
										{/each}
									</div>
								</Command.GroupItems>
							</Command.Group>
						{/each}
					</Command.Viewport>
				</Command.List>
				<Divider class="mb-sm" />
				<div class="inline-flex items-center gap-xs">
					<InfoIcon class="size-4 text-shade-300" />
					<p class="inline-flex items-center text-sm text-shade-300">
						Use <ArrowBigUpIcon class="h-lg" /> and <ArrowBigDownIcon class="h-lg" />
						arrows to move between emojis
					</p>
				</div>
			</Command.Root>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
