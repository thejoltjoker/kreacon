<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../../app.css';
	import Navbar from './_components/Navbar.svelte';

	interface Props {
		data: import('./$types').LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();
	let user = $state(data.user);
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<Navbar {user} />

{@render children()}
