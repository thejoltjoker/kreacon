<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { Tooltip } from 'bits-ui';
	import { t } from '$lib/i18n';
	let {
		isSignedIn,
		id,
		isVoted = $bindable(),
		isOpenForVoting = $bindable()
	}: { isSignedIn: boolean; id: string; isVoted: boolean; isOpenForVoting: boolean } = $props();

	const handleSubmit = () => {
		isVoted = !isVoted;
	};
</script>

{#if isVoted}
	<form method="POST" action="?/unvote" use:enhance={handleSubmit}>
		<Button type="submit" name="unvote" variant="muted" class="vote-button">{$t('Voted')}</Button>
	</form>
{:else if isSignedIn && isOpenForVoting}
	<form method="POST" action="?/vote" use:enhance={handleSubmit}>
		<Button type="submit" name="vote" class="vote-button">{$t('Vote')}</Button>
	</form>
{:else if isSignedIn && !isOpenForVoting}
	<Button variant="muted" name="vote" class="vote-button">{$t('Closed')}</Button>
{:else}
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button href="/login?redirect=/entries/{id}">{$t('Vote')}</Button>
			</Tooltip.Trigger>
			<Tooltip.Content sideOffset={5}>
				<div class="z-30 rounded-md bg-muted-background px-3 py-2 text-sm shadow-md">
					{$t('Sign in to vote')}
				</div>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
{/if}
