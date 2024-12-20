<script lang="ts">
	import { browser } from '$app/environment';
	import '$lib/i18n';
	import '@fontsource/noto-color-emoji';
	import { locale, waitLocale } from 'svelte-i18n';
	import '../app.css';
	import { page } from '$app/stores';
	import Navbar from './(app)/_components/Navbar.svelte';
	import Footer from './(app)/_components/Footer.svelte';
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

<div class="horizon">
	<div
		class="fixed bottom-0 left-0 -z-10 h-[50vh] w-screen bg-gradient-to-t from-[hsl(246,30%,9%)]"
	></div>
	<!-- <div
		class="fixed -bottom-[100px] left-1/2 h-[100px] w-[100px] -translate-x-1/2 scale-x-[8] rounded-full bg-transparent shadow-[0_-10px_200px_0_hsl(246,50%,30%)]"
	></div> -->
</div>
