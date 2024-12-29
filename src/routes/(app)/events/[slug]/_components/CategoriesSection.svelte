<script lang="ts">
	import type { PageData } from '../$types';
	import CategoriesAccordion from './CategoriesAccordion.svelte';

	let { categories }: { categories: PageData['categories'] } = $props();
</script>

<section class="w-full">
	<h2 class="text-h2 font-bold">Categories</h2>
	<CategoriesAccordion {categories} />
</section>
