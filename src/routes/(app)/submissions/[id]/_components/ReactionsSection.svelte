<script lang="ts">
	import type { PageData } from '../$types';
	import ReactionsListItem from './ReactionsListItem.svelte';

	let {
		reactions
	}: {
		reactions?: NonNullable<PageData['submission']>['reactions'];
	} = $props();
</script>

<div class="flex flex-col gap-sm">
	<h4>Reactions</h4>
	<ul class="grid grid-cols-1 gap-lg md:grid-cols-2">
		{#if reactions}
			{#each reactions as reaction}
				<ReactionsListItem {reaction} />
			{/each}
		{:else}
			<li>No reactions yet</li>
		{/if}
	</ul>
</div>
