<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import type { Snippet } from 'svelte';
	import '../../app.css';
	import AdminNavbar from './_components/AdminNavbar.svelte';
	import Footer from '../(app)/_components/Footer.svelte';
	import FilterBar from './_components/FilterBar.svelte';

	interface Props {
		data: import('./$types').LayoutData;
		children: Snippet;
	}

	let { children }: Props = $props();
	let title = $derived($page.data.title.text ?? 'Kreacon');
</script>

<svelte:head>
	<title>{$t(title)}</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<AdminNavbar title={$page.data.title} />
	<FilterBar />

	<div class="flex min-h-full grow flex-col items-center gap-xl">
		{@render children()}
	</div>
	<Footer />
</div>
