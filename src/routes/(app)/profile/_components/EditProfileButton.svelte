<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getContext } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';

	let { isEditing = $bindable() }: { isEditing: boolean } = $props();
	const superform = getContext<SuperForm<Record<string, unknown>>>('superform');
</script>

<Button
	type="button"
	variant="outline"
	onclick={() => {
		if (isEditing) {
			superform.reset();
		}
		isEditing = !isEditing;
	}}
>
	{isEditing ? 'Cancel' : 'Edit'}
</Button>
