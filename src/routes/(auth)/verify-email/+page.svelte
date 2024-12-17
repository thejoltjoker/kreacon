<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { t } from '$lib/i18n';
</script>

<h1>{$t('Verify Email')}</h1>
<form class="flex flex-col gap-sm">
	TODO
	<Button type="submit">{$t('Verify Email')}</Button>
</form>

<style lang="postcss">
	h1 {
		@apply text-2xl font-bold;
	}
</style>
