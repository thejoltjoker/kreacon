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

		if (browser) {
			const debugElements = document.querySelectorAll('.debug');
			debugElements.forEach((element) => {
				const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
				(element as HTMLElement).style.border = `1px solid ${randomColor}`;
			});
		}
	});
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

{@render children()}
