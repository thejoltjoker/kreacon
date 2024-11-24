<script lang="ts">
	import type { PageData } from '../$types';
	import ReactionsListItem from './ReactionsListItem.svelte';

	let {
		reactions,
		submission,
		user
	}: {
		reactions?: NonNullable<PageData['submission']>['reactions'];
		submission?: NonNullable<PageData['submission']>;
		user?: NonNullable<PageData['user']>;
	} = $props();
</script>

<div class="flex flex-col gap-sm">
	<h4>Reactions</h4>
	<ul class="grid-cols-reactions grid gap-lg">
		{#if reactions}
			{#each reactions as reaction}
				<ReactionsListItem {reaction} />
			{/each}
		{:else}
			<li>No reactions yet</li>
		{/if}
	</ul>
</div>
