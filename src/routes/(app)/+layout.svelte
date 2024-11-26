<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../../app.css';
	import Navbar from './_components/Navbar.svelte';

	interface Props {
		data: import('./$types').LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<Navbar user={data.user} />

{@render children()}
