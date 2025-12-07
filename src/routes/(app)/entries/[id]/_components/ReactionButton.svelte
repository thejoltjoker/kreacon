<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';

	import { page } from '$app/stores';
	import { Popover } from 'bits-ui';
	import { SmilePlusIcon } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import type { Emoji } from '$lib/emojis.svelte';

	const user = $derived($page.data.user);

	let {
		entryId: entryId,
		isAllowedToReact = $bindable()
	}: {
		entryId: string;
		isAllowedToReact: boolean;
	} = $props();

	const handleSubmit = async () => {
		isAllowedToReact = !isAllowedToReact;
	};
	const emojis: Emoji[] = [];
</script>

<Popover.Root>
	<Popover.Trigger>
		<Button variant="outline" size="icon" title="React">
			<SmilePlusIcon />
		</Button>
	</Popover.Trigger>
	<Popover.Content
		class="bg-muted-background p-sm z-30 max-h-[320px] w-fit max-w-[320px] overflow-hidden overflow-y-auto rounded-lg"
		sideOffset={5}
	>
		{#if user == null}
			<p>{$t('You must be logged in to share your reaction.')}</p>
			<Button href="/login?redirect=/entries/{entryId}" aria-label="Log in">{$t('Log in')}</Button>
		{:else if !isAllowedToReact}
			<p>{$t('You already reacted to this entry.')}</p>
			groupedEmojis
		{:else}
			<form method="POST" action="?/react" use:enhance={handleSubmit}>
				<div class="gap-xs flex flex-wrap">
					{#each emojis as emoji (emoji.emoji)}
						<Button
							type="submit"
							name="reaction"
							value={emoji.emoji}
							variant="ghost"
							size="icon"
							aria-label="React with {emoji.emoji}"
						>
							{emoji.emoji}
						</Button>
					{/each}
				</div>
			</form>
		{/if}
	</Popover.Content>
</Popover.Root>
