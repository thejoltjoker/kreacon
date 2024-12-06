<script>
	import Button from '$lib/components/Button.svelte';
	import DumbDialog from '$lib/components/DumbDialog.svelte';
	import { TrashIcon } from 'lucide-svelte';
</script>

<DumbDialog buttonText="Open Dialog">
	{#snippet trigger()}
		<Button variant="outline" size="icon">
			<TrashIcon />
		</Button>
	{/snippet}

	{#snippet title()}
		Account settings
	{/snippet}

	{#snippet description()}
		Manage your account settings and preferences.
	{/snippet}
</DumbDialog>
