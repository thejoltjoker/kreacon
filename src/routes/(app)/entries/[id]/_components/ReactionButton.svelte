<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { emojis } from '$lib/emojis';
	import { page } from '$app/stores';
	import { Popover } from 'bits-ui';
	import { SmilePlusIcon } from 'lucide-svelte';
	import { t } from '$lib/i18n';

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
</script>

<Popover.Root>
	<Popover.Trigger>
		<Button variant="outline" size="icon" title="React">
			<SmilePlusIcon />
		</Button>
	</Popover.Trigger>
	<Popover.Content
		class="z-30 max-h-[320px] w-fit max-w-[320px] overflow-hidden overflow-y-auto rounded-lg bg-muted-background p-sm"
		sideOffset={5}
	>
		{#if user == null}
			<p>{$t('You must be logged in to share your reaction.')}</p>
			<Button href="/login?redirect=/entries/{entryId}">{$t('Log in')}</Button>
		{:else if !isAllowedToReact}
			<p>{$t('You already reacted to this entry.')}</p>
		{:else}
			<!-- TODO Allow user to change reaction -->
			<form method="POST" action="?/react" use:enhance={handleSubmit}>
				<div class="flex flex-wrap gap-xs">
					{#each emojis as emoji}
						<Button type="submit" name="reaction" value={emoji} variant="ghost" size="icon">
							{emoji}
						</Button>
					{/each}
				</div>
			</form>
		{/if}
	</Popover.Content>
</Popover.Root>
