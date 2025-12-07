<script lang="ts">
	import { ImageIcon, Settings2Icon } from 'lucide-svelte';
	import type { Field } from './types';
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
	class="gap-sm border-b-divider px-xl py-sm first-of-type:pt-sm hover:bg-shade-900 flex flex-wrap border-b last-of-type:border-b-0"
>
	{#if hasThumbnail}
		<div
			class="size-form min-w-form text-shade-400 flex items-center justify-center overflow-hidden"
		>
			<ImageIcon class="size-5" aria-label={$t('Image')} />
		</div>
	{/if}
	{#each fieldsToRender as field (field.name)}
		<EntityListHeaderField {field} {handleSortByChange} />
	{/each}
	<li class="size-form text-shade-400 flex items-center justify-center">
		<Settings2Icon class="size-5" />
	</li>
</ul>
