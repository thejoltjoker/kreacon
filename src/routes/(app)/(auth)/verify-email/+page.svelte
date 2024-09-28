<script>
	import Button from '$lib/components/Button.svelte';
	import InputField from '$lib/components/InputField.svelte';
</script>

<h1>Verify Email</h1>
<form class="flex flex-col gap-sm">
	<InputField label="Verify Email" type="text" name="token" placeholder="Verification Token" />
	<Button type="submit" variant="rose">Verify Email</Button>
</form>

<style lang="postcss">
	h1 {
		@apply text-2xl font-bold;
	}
</style>
