<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Label } from 'bits-ui';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	let { data }: { data: PageData } = $props();

	// Client API:
	const { form } = superForm(data.form);
</script>

<SuperDebug data={$form} />
<form method="POST">
	<Label.Root for="password1" class="flex flex-col gap-xs">
		<p>Password1</p>
		<input type="password" name="password1" bind:value={$form.password1} />
	</Label.Root>
	<Label.Root for="password2" class="flex flex-col gap-xs">
		<p>Password2</p>
		<input type="password" name="password2" bind:value={$form.password2} />
	</Label.Root>
	<Button class="grow-0">Change password</Button>
</form>

<style lang="postcss">
	form {
		@apply flex w-full flex-col gap-md;
	}
</style>
