<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../../app.css';
	import Navbar from './_components/Navbar.svelte';
	import Footer from './_components/Footer.svelte';

	interface Props {
		data: import('./$types').LayoutData;
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Navbar />

	<div class="flex min-h-full grow flex-col items-center">
		{@render children()}
	</div>
	<Footer />
</div>
