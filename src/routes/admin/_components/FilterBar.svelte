<script lang="ts">
	import { page } from '$app/stores';
	import AccountMenu from '$lib/components/AccountMenu.svelte';
	import Button from '$lib/components/Button.svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import Link from '$lib/components/Link.svelte';
	import { t } from '$lib/i18n';
	import { AlignJustifyIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import SortBySelect from '../../(app)/_components/SortBySelect.svelte';
	import EventCombobox from '../../(app)/submissions/_components/EventCombobox.svelte';
	import TextFilter from '../../(app)/_components/TextFilter.svelte';

	const sortByItems = [
		{ label: 'Newest', value: 'newest' },
		{ label: 'Oldest', value: 'oldest' },
		{ label: 'Name (A-Z)', value: 'name_asc' },
		{ label: 'Name (Z-A)', value: 'name_desc' },
		{ label: 'Random', value: 'random' }
	];
</script>

<section>
	<div class="mx-auto w-full">
		<div class="flex items-center gap-sm">
			<Button variant="outline" icon={PlusIcon}>Add event</Button>
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
