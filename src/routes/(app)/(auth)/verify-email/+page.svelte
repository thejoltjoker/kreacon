<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { _ } from 'svelte-i18n';
</script>

<h1>{$_('verify_email', { default: 'Verify Email' })}</h1>
<form class="flex flex-col gap-sm">
	TODO
	<Button type="submit" variant="rose">
		{$_('verify_email', { default: 'Verify Email' })}
	</Button>
</form>

<style lang="postcss">
	h1 {
		@apply text-2xl font-bold;
	}
</style>
