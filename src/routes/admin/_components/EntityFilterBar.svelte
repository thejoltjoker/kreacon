<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { PlusIcon } from 'lucide-svelte';
	import SortBySelect from '../../(app)/_components/SortBySelect.svelte';
	import TextFilter from '../../(app)/_components/TextFilter.svelte';
	let { entityName }: { entityName: string } = $props();
</script>

<section class="w-full">
	<div class="mx-auto w-full">
		<div class="flex items-center gap-sm">
			<Button href={`/admin/${entityName}/create`} variant="outline" icon={PlusIcon}>
				Add {entityName}
			</Button>
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
