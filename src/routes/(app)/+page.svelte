<script lang="ts">
	import { user } from '$lib/stores/user';
	import type { PageData } from './$types';
	import HeroSection from './_components/HeroSection.svelte';

	let { data }: { data: PageData } = $props();

	user.set(data.user);
</script>

<div class="flex grow flex-col items-center justify-center">
	<HeroSection />
</div>
