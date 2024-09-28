<script>
	import '../../app.css';
	import Navbar from './_components/Navbar.svelte';
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<Navbar />
<main>
	<slot />
</main>

<style lang="postcss">
	main {
		@apply px-sm py-xs;
	}
</style>
