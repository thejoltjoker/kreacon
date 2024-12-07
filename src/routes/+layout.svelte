<script lang="ts">
	import { browser } from '$app/environment';
	import '$lib/i18n';
	import '@fontsource/noto-color-emoji';
	import { locale, waitLocale } from 'svelte-i18n';
	import '../app.css';
	import { page } from '$app/stores';
	import Navbar from './(app)/_components/Navbar.svelte';
	import Footer from './(app)/_components/Footer.svelte';
	import { t } from '$lib/i18n';
	let { children } = $props();
	let ready = $state(false);

	$effect(() => {
		if (browser) {
			const storedLocale = localStorage.getItem('locale');
			locale.set(storedLocale ?? window.navigator.language);
			waitLocale().then(() => {
				ready = true;
			});
		}
	});
</script>

<svelte:head>
	<title>{$page.data.title.text ?? 'Kreacon'}</title>
</svelte:head>

{#if ready}
	<div class="flex min-h-screen flex-col">
		<Navbar title={$page.data.title} />

		{@render children()}

		<Footer />
	</div>
{/if}
