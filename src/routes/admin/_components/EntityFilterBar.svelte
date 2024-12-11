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
		<div class="flex items-center gap-sm">
			{#if buttons}
				{@render buttons()}
			{:else if buttons === undefined}
				{@render defaultButtons()}
			{/if}

			<div class="ml-auto inline-flex items-center gap-sm">
				<TextFilter />
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
	section {
		@apply flex items-center justify-between gap-sm border-b border-b-divider px-sm py-sm md:px-xl;
	}
</style>
