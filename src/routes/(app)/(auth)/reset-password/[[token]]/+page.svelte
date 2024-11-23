<script>
	import Button from '$lib/components/OldButton.svelte';
	import { _ } from 'svelte-i18n';
</script>

<h1>{$_('reset_password', { default: 'Reset Password' })}</h1>
<form class="flex flex-col gap-sm">
	TODO
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
