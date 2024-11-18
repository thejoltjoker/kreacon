<script lang="ts">
	import { browser } from '$app/environment';
	import '$lib/i18n';
	import { locale, waitLocale } from 'svelte-i18n';
	import '../app.css';
	import type { LayoutData } from './$types';

	let { children } = $props();

	$effect(() => {
		if (browser) {
			locale.set(window.navigator.language);
		}
		waitLocale().then(() => {
			console.log('Locale loaded');
		});
	});
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

{@render children()}
