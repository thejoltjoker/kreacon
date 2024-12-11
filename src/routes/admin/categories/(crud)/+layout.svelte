<script lang="ts">
	import type { Snippet } from 'svelte';
	import CategoryForm from './_components/CategoryForm.svelte';

	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
<div class="flex w-full max-w-screen-md p-sm md:p-xl">
	<CategoryForm />
</div>
