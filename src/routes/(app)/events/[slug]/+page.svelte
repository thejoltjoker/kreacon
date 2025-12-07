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

<div
	class="gap-xl px-sm py-xl flex w-full max-w-(--breakpoint-lg) flex-col items-center justify-center"
>
	<Header event={data.event} />
	<main class="gap-xl py-xl flex w-full flex-col items-center justify-center">
		<AboutSection event={data.event} />
		<TimesSection event={data.event} />
		<RulesSection event={data.event} />
		<CategoriesSection {categories} />
	</main>
</div>
