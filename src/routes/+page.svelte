<script lang="ts">
	import Footer from './(app)/_components/Footer.svelte';
	import HeroSection from './(app)/_components/HeroSection.svelte';
	import Navbar from './(app)/_components/Navbar.svelte';
</script>

<svelte:head>
	<title>Kreacon</title>
</svelte:head>

<div class="flex min-h-full grow flex-col items-center">
	<div class="flex grow flex-col items-center justify-center">
		<HeroSection />
	</div>
</div>
<Footer />
