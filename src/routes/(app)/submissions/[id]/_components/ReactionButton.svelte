<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { emojis } from '$lib/emojis';
	import { user } from '$lib/stores/user';
	import { Popover } from 'bits-ui';
	import { SmilePlusIcon } from 'lucide-svelte';

	let {
		submissionId,
		isAllowedToReact = $bindable()
	}: {
		submissionId: string;
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
		class="z-50 max-h-[320px] w-fit max-w-[320px] overflow-hidden overflow-y-auto rounded-lg bg-muted-background p-sm"
		sideOffset={5}
	>
		{#if $user == null}
			<p>You must be logged in to share your reaction.</p>
			<Button href="/login?redirect=/submissions/{submissionId}">Log in</Button>
		{:else if !isAllowedToReact}
			<p>You already reacted to this submission.</p>
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
