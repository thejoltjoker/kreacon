<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
</script>

<svelte:head>
	<title>{$t('Error')}</title>
</svelte:head>

<div class="flex min-h-full grow flex-col items-center justify-center gap-xl text-center">
	<h1 class="text-6xl font-bold">{$page.status}</h1>
	<h2 class="text-shade-300-alt font-normal">{$page.error?.message}</h2>
</div>
