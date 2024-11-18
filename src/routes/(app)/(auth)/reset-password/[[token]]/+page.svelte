<script>
	import Button from '$lib/components/Button.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import { _ } from 'svelte-i18n';
</script>

<h1>{$_('reset_password', { default: 'Reset Password' })}</h1>
<form class="flex flex-col gap-sm">
	<InputField
		label={$_('new_password', { default: 'New Password' })}
		type="password"
		name="password"
		placeholder={$_('new_password', { default: 'New Password' })}
	/>
	<Button type="submit" variant="rose">
		{$_('reset_password', { default: 'Reset Password' })}
	</Button>
</form>

<style lang="postcss">
	h1 {
		/* TODO Tailwind title sizes */
		@apply text-2xl font-bold;
	}
</style>
