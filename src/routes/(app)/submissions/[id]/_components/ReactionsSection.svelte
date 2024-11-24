<script lang="ts">
	import type { PageData } from '../$types';
	import ReactionsListItem from './ReactionsListItem.svelte';

	let {
		reactions,
		submission,
		user
	}: {
		reactions: NonNullable<PageData['submission']>['reactions'];
		submission: NonNullable<PageData['submission']>;
		user: NonNullable<PageData['user']>;
	} = $props();
</script>

<div class="card">
	<div class="flex items-center">
		<div>
			<p class="text-sm text-gray-500">Rebound of</p>
			<p class="font-medium">{submission?.title}</p>
			<p class="text-sm text-gray-500">By {user?.username}</p>
		</div>
	</div>
	<ul>
		{#each reactions as reaction}
			<li>
				<ReactionsListItem {reaction} />
			</li>
		{/each}
	</ul>
</div>
