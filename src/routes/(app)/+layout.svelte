<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../../app.css';
	import Navbar from './_components/Navbar.svelte';
	import { user } from '$lib/stores/user';

	interface Props {
		data: import('./$types').LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();

	user.set(data.user);
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<Navbar />

{@render children()}
