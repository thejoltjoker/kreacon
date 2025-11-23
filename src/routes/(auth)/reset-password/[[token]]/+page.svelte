<script>
	import Button from '$lib/components/Button.svelte';
	import { t } from '$lib/i18n';
</script>

<h1>{$t('Reset Password')}</h1>
<form class="gap-sm flex flex-col">
	TODO
	<Button type="submit">{$t('Reset Password')}</Button>
</form>

<style lang="postcss">
	@reference "../../../../app.css";

	h1 {
		/* TODO Tailwind title sizes */
		@apply text-2xl font-bold;
	}
</style>
