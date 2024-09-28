<script>
	import Button from '$lib/components/Button.svelte';
	import InputField from '$lib/components/InputField.svelte';
</script>

<h1>Reset Password</h1>
<form class="flex flex-col gap-sm">
	<InputField label="New Password" type="password" name="password" placeholder="New Password" />
	<Button type="submit" variant="rose">Reset Password</Button>
</form>

<style lang="postcss">
	h1 {
		/* TODO Tailwind title sizes */
		@apply text-2xl font-bold;
	}
</style>
