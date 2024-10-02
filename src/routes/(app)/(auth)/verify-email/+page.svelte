<script>
	import Button from '$lib/components/Button.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import { _ } from 'svelte-i18n';
</script>

<h1>{$_('auth.verify_email', { default: 'Verify Email' })}</h1>
<form class="flex flex-col gap-sm">
	<InputField
		label="Verify Email"
		type="text"
		name="token"
		placeholder={$_('auth.verification_token', { default: 'Verification token' })}
	/>
	<Button type="submit" variant="rose">
		{$_('button.verify_email', { default: 'Verify Email' })}
	</Button>
</form>

<style lang="postcss">
	h1 {
		@apply text-2xl font-bold;
	}
</style>
