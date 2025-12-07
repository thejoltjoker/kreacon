<script lang="ts">
	import AlertDialog from '$lib/components/AlertDialog.svelte';
	import Button from '$lib/components/Button.svelte';
	import { TrashIcon } from 'lucide-svelte';
	import { type PageData } from '../$types';

	let {
		user,
		entry
	}: { user: NonNullable<PageData['user']>; entry: NonNullable<PageData['entry']> } = $props();
	let deleteFormRef = $state<HTMLFormElement | null>(null);

	const handleDelete = () => {
		if (user?.username != entry?.user?.username) {
			throw new Error('Unauthorized to delete this entry');
		}
		deleteFormRef?.submit();
	};
</script>

<form method="POST" action="?/delete" bind:this={deleteFormRef}>
	<AlertDialog variant="destructive" onConfirm={handleDelete}>
		{#snippet title()}
			<h2>Delete entry</h2>
		{/snippet}
		{#snippet description()}
			<p>
				Are you sure you want to delete this entry?
				<br />
				<span class="text-destructive">This action cannot be undone!</span>
			</p>
			<p class="pt-sm text-shade-300 text-sm">
				Deleting this entry will allow you to submit a new one to the same category and event.
			</p>
		{/snippet}
		{#snippet trigger()}
			<Button type="submit" size="icon" variant="destructive" class="entry-delete-button">
				<TrashIcon />
			</Button>
		{/snippet}
	</AlertDialog>
</form>
