<script lang="ts">
	import type { PageData } from './$types';
	import Header from './_components/Header.svelte';
	import AboutSection from './_components/AboutSection.svelte';
	import RulesSection from './_components/RulesSection.svelte';
	import CategoriesSection from './_components/CategoriesSection.svelte';
	import TimesSection from './_components/TimesSection.svelte';

	let { data }: { data: PageData } = $props();

	const categories = data.categories;
</script>

<div class="flex w-full max-w-screen-lg flex-col items-center justify-center gap-xl px-sm py-xl">
	<Header event={data.event} />
	<main class="flex w-full flex-col items-center justify-center gap-xl py-xl">
		<AboutSection event={data.event} />
		<TimesSection event={data.event} />
		<RulesSection event={data.event} />
		<CategoriesSection {categories} />
	</main>
</div>
