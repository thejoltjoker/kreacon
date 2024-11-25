<script lang="ts">
	import { browser } from '$app/environment';
	import '$lib/i18n';
	import '@fontsource/noto-color-emoji';
	import { locale, waitLocale } from 'svelte-i18n';
	import '../app.css';
	let { children } = $props();
	let ready = $state(false);

	$effect(() => {
		if (browser) {
			locale.set(window.navigator.language);
			waitLocale().then(() => {
				ready = true;
			});
		}
	});
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

{#if ready}
	{@render children()}
{/if}
