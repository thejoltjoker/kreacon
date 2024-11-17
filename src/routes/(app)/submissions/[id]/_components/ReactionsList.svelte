<script lang="ts">
	import type { PageData } from '../$types';
	import { SmileIcon } from 'lucide-svelte';
	import ReactionsListItem from './ReactionsListItem.svelte';

	type Reactions = NonNullable<PageData['submission']>['reactions'];

	export let reactions: Reactions;
</script>

<div class="reactions">
	<div class="flex items-center gap-2">
		<h3 class="text-xl font-bold">Reactions</h3>
		<!-- <div
			class="ml-auto flex size-button items-center justify-center rounded-full border border-white"
		>
			<SmileIcon class="size-6" />
		</div> -->
	</div>
	<ul>
		{#each reactions as reaction}
			<ReactionsListItem {reaction} />
		{/each}
	</ul>
</div>

<style lang="postcss">
	ul {
		@apply flex flex-col gap-sm;
	}
</style>
