<script lang="ts">
	import { user } from '$lib/stores/user';
	import type { PageData } from './$types';
	import HeroSection from './_components/HeroSection.svelte';

	let { data }: { data: PageData } = $props();

	user.set(data.user);
</script>

<HeroSection />

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
