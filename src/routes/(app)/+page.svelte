<script lang="ts">
	import type { PageData } from './$types';
	import HeroSection from './_components/HeroSection.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex grow flex-col items-center justify-center">
	<HeroSection />
</div>
