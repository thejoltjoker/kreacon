<script lang="ts">
	import type { Category } from '../data';
	import CategoriesAccordion from './CategoriesAccordion.svelte';

	let { categories }: { categories: Category[] } = $props();
</script>

<section class="w-full">
	<h2 class="text-h2 font-bold">Categories</h2>
	<CategoriesAccordion {categories} />
</section>
