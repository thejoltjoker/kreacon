<!-- TODO Manually add buttons -->
<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { PlusIcon } from 'lucide-svelte';
	import TextFilter from '../../(app)/_components/TextFilter.svelte';
	import type { Snippet } from 'svelte';
	let { entityName, buttons }: { entityName: string; buttons?: Snippet | false } = $props();
</script>

{#snippet defaultButtons()}
	<Button href={`/admin/${entityName}/create`} variant="outline" icon={PlusIcon}>
		Add {entityName}
	</Button>
{/snippet}
<section class="w-full">
	<div class="mx-auto w-full">
		<div class="gap-sm flex items-center">
			{#if buttons}
				{@render buttons()}
			{:else if buttons === undefined}
				{@render defaultButtons()}
			{/if}

			<div class="gap-sm ml-auto inline-flex items-center">
				<TextFilter />
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
	@reference "../../../app.css";

	section {
		@apply gap-sm border-b-divider px-sm py-sm md:px-xl flex items-center justify-between border-b;
	}
</style>
