<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import '$lib/i18n';
	import type { Snippet } from 'svelte';
	import { locale, waitLocale } from 'svelte-i18n';
	import '../app.css';
	import type { LayoutData } from './$types';
	import Footer from './(app)/_components/Footer.svelte';
	import Navbar from './(app)/_components/Navbar.svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
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
		<PageTransition key={data.pathname} class="flex min-h-full grow flex-col">
			{@render children()}
		</PageTransition>
		<Footer />
	</div>
{/if}

<div class="horizon">
	<div
		class="fixed bottom-0 left-0 -z-10 h-[50vh] w-screen bg-gradient-to-t from-[hsl(246,30%,9%)]"
	></div>
</div>
