<script lang="ts">
	import { ImageIcon, Settings2Icon } from 'lucide-svelte';
	import type { Field, Item } from './types';
	import { t } from '$lib/i18n';
	import EntityListHeaderField from './EntityListHeaderField.svelte';

	interface EntityListHeaderProps {
		fieldsToRender: Field[];
		hasThumbnail: boolean;
		handleSortByChange: (sortBy: string) => void;
	}

	let { fieldsToRender, hasThumbnail, handleSortByChange }: EntityListHeaderProps = $props();
</script>

<ul
	class="flex flex-wrap gap-sm border-b border-b-divider px-xl py-sm first-of-type:pt-sm last-of-type:border-b-0 hover:bg-shade-900"
>
	{#if hasThumbnail}
		<div
			class="flex size-form min-w-form items-center justify-center overflow-hidden text-shade-400"
		>
			<ImageIcon class="size-5" aria-label={$t('Image')} />
		</div>
	{/if}
	{#each fieldsToRender as field}
		<EntityListHeaderField {field} {handleSortByChange} />
	{/each}
	<li class="flex size-form items-center justify-center text-shade-400">
		<Settings2Icon class="size-5" />
	</li>
</ul>
