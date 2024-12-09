<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { PlusIcon } from 'lucide-svelte';
	import SortBySelect from '../../(app)/_components/SortBySelect.svelte';
	import TextFilter from '../../(app)/_components/TextFilter.svelte';

	const sortByItems = [
		{ label: 'Newest', value: 'newest' },
		{ label: 'Oldest', value: 'oldest' },
		{ label: 'Name (A-Z)', value: 'name_asc' },
		{ label: 'Name (Z-A)', value: 'name_desc' },
		{ label: 'Random', value: 'random' }
	];
</script>

<section class="w-full">
	<div class="mx-auto w-full">
		<div class="flex items-center gap-sm">
			<Button href="/admin/events/create" variant="outline" icon={PlusIcon}>Add event</Button>
			<div class="ml-auto inline-flex items-center gap-sm">
				<!-- <DumbInput icon={SearchIcon} placeholder="Search" /> -->
				<TextFilter />
				<SortBySelect items={sortByItems} />
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
	section {
		@apply flex items-center justify-between gap-sm border-b border-b-divider px-sm py-sm md:px-xl;
	}
</style>
